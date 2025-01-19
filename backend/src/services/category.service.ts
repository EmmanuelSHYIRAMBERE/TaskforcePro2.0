import { FilterQuery } from "mongoose";
import { Category, ICategory } from "../models/category.model";

// Define the tree node structure
interface CategoryTreeNode {
  id: ICategory["_id"];
  name: string;
  type: "EXPENSE" | "INCOME";
  children: CategoryTreeNode[];
}

export class CategoryService {
  static async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    const existingCategory = await Category.findOne({
      user: data.user,
      name: data.name,
      parent: data.parent || null,
    });

    if (existingCategory) {
      throw new Error("Category with this name already exists at this level");
    }

    return Category.create(data);
  }

  static async getCategories(
    userId: string,
    filters: FilterQuery<ICategory> = {}
  ): Promise<ICategory[]> {
    return Category.find({ user: userId, parent: null, ...filters })
      .populate({
        path: "subcategories",
        populate: {
          path: "subcategories",
          populate: "subcategories",
        },
      })
      .sort({ name: 1 });
  }

  static async getCategoryById(
    categoryId: string,
    userId: string
  ): Promise<ICategory> {
    const category = await Category.findOne({
      _id: categoryId,
      user: userId,
    }).populate({
      path: "subcategories",
      populate: {
        path: "subcategories",
        populate: "subcategories",
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  static async updateCategory(
    categoryId: string,
    userId: string,
    updates: Partial<ICategory>
  ): Promise<ICategory> {
    if (updates.name) {
      const existingCategory = await Category.findOne({
        user: userId,
        name: updates.name,
        parent: updates.parent || null,
        _id: { $ne: categoryId },
      });

      if (existingCategory) {
        throw new Error("Category with this name already exists at this level");
      }
    }

    const category = await Category.findOneAndUpdate(
      { _id: categoryId, user: userId },
      updates,
      { new: true, runValidators: true }
    ).populate("subcategories");

    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  static async deleteCategory(
    categoryId: string,
    userId: string
  ): Promise<ICategory | null> {
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      throw new Error("Category not found");
    }

    const hasSubcategories = await Category.exists({ parent: categoryId });
    if (hasSubcategories) {
      throw new Error("Cannot delete category with subcategories");
    }

    const { Transaction } = require("../models/transaction.model");
    const hasTransactions = await Transaction.exists({ category: categoryId });
    if (hasTransactions) {
      return this.updateCategory(categoryId, userId, { isActive: false });
    }

    return Category.findByIdAndDelete(categoryId);
  }

  static async getCategoryHierarchy(
    userId: string
  ): Promise<CategoryTreeNode[]> {
    const categories = await this.getCategories(userId);
    return this.buildHierarchyTree(categories);
  }

  private static buildHierarchyTree(
    categories: ICategory[]
  ): CategoryTreeNode[] {
    const buildTree = (category: ICategory): CategoryTreeNode => {
      const node: CategoryTreeNode = {
        id: category._id,
        name: category.name,
        type: category.type,
        children: category.subcategories
          ? category.subcategories.map((sub) => buildTree(sub as ICategory))
          : [],
      };
      return node;
    };

    return categories.map((category) => buildTree(category));
  }
}
