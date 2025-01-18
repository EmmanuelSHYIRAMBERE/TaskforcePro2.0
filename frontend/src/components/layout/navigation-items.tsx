import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Tags,
  PieChart,
  FileText,
  Settings,
  HelpCircle,
  UserCircle,
  BellRing,
  Target,
  CreditCard,
} from "lucide-react";

export const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your finances",
  },
  {
    name: "Accounts",
    href: "/accounts",
    icon: Wallet,
    description: "Manage your accounts",
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
    description: "View and manage transactions",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Tags,
    description: "Organize your spending",
  },
  {
    name: "Budget",
    href: "/budget",
    icon: PieChart,
    description: "Set and track budgets",
  },
  {
    name: "Goals",
    href: "/goals",
    icon: Target,
    description: "Track financial goals",
  },
  {
    name: "Bills",
    href: "/bills",
    icon: CreditCard,
    description: "Manage recurring bills",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    description: "View financial reports",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage preferences",
  },
  {
    name: "Help",
    href: "/help",
    icon: HelpCircle,
    description: "Get support",
  },
];

interface NavigationItemsProps {
  className?: string;
}

export const NavigationItems = ({ className }: NavigationItemsProps) => {
  const location = useLocation();

  return (
    <nav className={className}>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100",
              isActive && "bg-gray-100 text-gray-900"
            )}
          >
            <Icon className="h-5 w-5" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs text-gray-500">{item.description}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};
