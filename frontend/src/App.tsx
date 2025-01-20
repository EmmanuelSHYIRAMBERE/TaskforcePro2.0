import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import { MainLayout } from "./components/layout/main-layout";
import { PrivateRoute } from "./components/auth/private-route";
import Transactions from "./pages/transactions";
import Reports from "./pages/report";
import { SignIn } from "./components/auth/sign-in";
import { SignUp } from "./components/auth/sign-up";
import { Settings } from "./pages/settings";
import Dashboard from "./pages/dashboard";
import Accounts from "./pages/accounts";
import Categories from "./pages/categories";
import Budget from "./pages/Budget";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
