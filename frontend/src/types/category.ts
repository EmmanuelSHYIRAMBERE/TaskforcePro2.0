export interface Category {
  _id: string;
  name: string;
  description?: string;
  type: "EXPENSE" | "INCOME";
  parent?: string;
  color: string;
  icon: string;
  isActive: boolean;
  subcategories?: Category[];
}

export interface CategoryFormData {
  name: string;
  description: string;
  type: "EXPENSE" | "INCOME";
  color: string;
  icon: string;
  parent?: string;
}
