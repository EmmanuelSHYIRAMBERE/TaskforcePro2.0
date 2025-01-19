import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export const MainLayout = () => {
  return (
    <div className="flex h-full absolute top-0 left-0 bottom-0 right-0 overflow-hidden bg-[#F4F4F4]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:ml-72">
          <div className="max-w-[1920px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
