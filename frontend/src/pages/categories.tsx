import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, CategoryFormData } from "@/types/category";
import usePost from "@/hooks/use-post";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/forms/category-form";
import { CategoryStats } from "@/components/category-stats";
import { CategoryTree } from "@/components/category-tree";
import useFetch from "@/hooks/use-fetch";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: categoriesData } = useFetch("/categories");

  const categories = categoriesData?.data || [];

  const { add, error } = usePost("/categories");

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleCreateCategory = async (formData: CategoryFormData) => {
    try {
      await add(formData as unknown as Record<string, unknown>);

      toast({
        title: "Success",
        description: "Category created successfully",
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.log("Error creating category", error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async (formData: CategoryFormData) => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(
        `/api/v1/categories/${selectedCategory._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update category");

      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.log("Error updating category", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSubmit={handleCreateCategory} />
          </DialogContent>
        </Dialog>
      </div>

      <CategoryStats categories={categories} />

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryTree
            categories={categories}
            onEdit={(category: Category) => {
              setSelectedCategory(category);
              setIsEditModalOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            mode="edit"
            initialData={selectedCategory ?? undefined}
            onSubmit={handleEditCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Categories;
