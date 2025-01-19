import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import usePost from "@/hooks/use-post";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { add, isAdding } = usePost("/api/v1/auth/login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await add({ email, password });

      console.log("response sign in", response);

      if (response && response.access_token) {
        localStorage.setItem("token", response.access_token);
        toast({
          title: "Success",
          description: "Successfully signed in! Redirecting...",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error signing in", error);
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
      });
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
