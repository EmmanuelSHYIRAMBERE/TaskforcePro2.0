import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import usePost from "@/hooks/use-post";
import { Link } from "react-router-dom"; // Import Link for navigation

export const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error state

  const { add, isAdding } = usePost("/api/v1/auth/login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await add({ email, password });
      // Assuming the response contains the token
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        navigate("/dashboard"); // Redirect to dashboard after successful login
      }
    } catch (error) {
      console.log("Error signing in:", error);
      setErrorMessage("Invalid email or password"); // Display error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}{" "}
            {/* Show error message */}
            <Button type="submit" className="w-full" disabled={isAdding}>
              {isAdding ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
