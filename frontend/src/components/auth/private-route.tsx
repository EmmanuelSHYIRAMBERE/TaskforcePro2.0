import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  // Replace this with your actual auth check
  const isAuthenticated = localStorage.getItem("token") !== null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};
