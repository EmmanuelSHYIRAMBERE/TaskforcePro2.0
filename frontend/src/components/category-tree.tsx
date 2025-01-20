import React, { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { useToast } from "@/hooks/use-toast";

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onEdit,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.log("Error deleting category", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const renderCategory = (category: Category, level = 0) => {
    const hasSubcategories =
      category.subcategories?.length !== undefined &&
      category.subcategories?.length > 0;
    const isExpanded = expanded[category._id];

    return (
      <React.Fragment key={category._id}>
        <TableRow>
          <TableCell className="font-medium">
            <div
              className="flex items-center"
              style={{ paddingLeft: `${level * 20}px` }}
            >
              {hasSubcategories && (
                <button
                  onClick={() => toggleExpand(category._id)}
                  className="mr-2"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </div>
          </TableCell>
          <TableCell>{category.type}</TableCell>
          <TableCell>{category.description}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(category)}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(category._id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {hasSubcategories && isExpanded && (
          <>
            {category.subcategories?.map((subcategory) =>
              renderCategory(subcategory, level + 1)
            )}
          </>
        )}
      </React.Fragment>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => renderCategory(category))}
      </TableBody>
    </Table>
  );
};
