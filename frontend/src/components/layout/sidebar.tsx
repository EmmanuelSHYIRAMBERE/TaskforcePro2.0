import { NavigationItems } from "./navigation-items";

export const Sidebar = () => {
  return (
    <div className="hidden border-r bg-gray-100/40 lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex flex-col gap-2 px-4 py-6">
        <NavigationItems className="flex flex-col gap-2" />
      </div>
    </div>
  );
};
