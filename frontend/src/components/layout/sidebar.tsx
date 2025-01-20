import { NavigationItems } from "./navigation-items";

export const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden lg:flex lg:w-72 lg:flex-col">
      <div className="flex flex-col flex-grow border-r bg-white">
        <div className="flex-1 flex flex-col min-h-0 pt-16">
          <div className="flex-1 flex flex-col gap-2 px-4 py-6">
            <NavigationItems className="flex flex-col gap-2" />
          </div>
        </div>
      </div>
    </aside>
  );
};
