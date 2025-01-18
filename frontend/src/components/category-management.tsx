import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Food & Dining",
      subcategories: ["Groceries", "Restaurants", "Coffee Shops"],
    },
    {
      id: 2,
      name: "Transportation",
      subcategories: ["Fuel", "Public Transit", "Car Maintenance"],
    },
    {
      id: 3,
      name: "Entertainment",
      subcategories: ["Movies", "Games", "Events"],
    },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: "",
    subcategory: "",
  });

  const handleAddCategory = () => {
    if (newCategory.name) {
      setCategories([
        ...categories,
        {
          id: categories.length + 1,
          name: newCategory.name,
          subcategories: [],
        },
      ]);
      setNewCategory({ name: "", subcategory: "" });
      toast.success("Category added successfully");
    }
  };

  const handleAddSubcategory = (categoryId: number) => {
    if (newCategory.subcategory) {
      setCategories(
        categories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              subcategories: [
                ...category.subcategories,
                newCategory.subcategory,
              ],
            };
          }
          return category;
        })
      );
      setNewCategory({ ...newCategory, subcategory: "" });
      toast.success("Subcategory added successfully");
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
    toast.success("Category deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category Name</label>
                <Input
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder="Enter category name"
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Accordion type="single" collapsible className="space-y-4">
          {categories.map((category) => (
            <AccordionItem key={category.id} value={category.id.toString()}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span>{category.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add subcategory"
                        value={newCategory.subcategory}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            subcategory: e.target.value,
                          })
                        }
                      />
                      <Button onClick={() => handleAddSubcategory(category.id)}>
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {category.subcategories.map((subcategory, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span>{subcategory}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CategoryManagement;
