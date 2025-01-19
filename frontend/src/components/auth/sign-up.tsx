import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import usePost from "@/hooks/use-post"; // Custom hook for POST requests

export const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Error state

  const { add, isAdding, data, error } = usePost("/api/v1/user");

  console.log("data", data);
  console.log("error", error);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password confirmation if needed
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      // Call your API to register the user
      await add(formData);
      navigate("/signin"); // Redirect to the sign-in page after successful registration
    } catch (error) {
      console.log("Error signing up:", error);
      setErrorMessage("Failed to register, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}{" "}
            {/* Show error message */}
            <Button type="submit" className="w-full" disabled={isAdding}>
              {isAdding ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
