import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import usePost from "@/hooks/use-post";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
}

interface ValidationState {
  isValid: boolean;
  message: string;
}

interface FormValidationState {
  name: ValidationState;
  email: ValidationState;
  phone: ValidationState;
  password: ValidationState;
  confirmPassword: ValidationState;
  general?: ValidationState;
}

export const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [validationState, setValidationState] = useState<FormValidationState>({
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phone: { isValid: true, message: "" },
    password: { isValid: true, message: "" },
    confirmPassword: { isValid: true, message: "" },
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const { add, isAdding, error } = usePost("/user");

  console.log("error", error);

  const validatePassword = (password: string): ValidationState => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const requirements: string[] = [];
    if (password.length < minLength) requirements.push("at least 8 characters");
    if (!hasUpperCase) requirements.push("an uppercase letter");
    if (!hasLowerCase) requirements.push("a lowercase letter");
    if (!hasNumbers) requirements.push("a number");
    if (!hasSpecialChar) requirements.push("a special character");

    return {
      isValid: requirements.length === 0,
      message:
        requirements.length > 0
          ? `Password must contain ${requirements.join(", ")}`
          : "",
    };
  };

  const validateEmail = (email: string): ValidationState => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email)
        ? ""
        : "Please enter a valid email address",
    };
  };

  const validatePhone = (phone: string): ValidationState => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return {
      isValid: phoneRegex.test(phone),
      message: phoneRegex.test(phone)
        ? ""
        : "Please enter a valid phone number",
    };
  };

  const validateName = (name: string): ValidationState => {
    return {
      isValid: name.length >= 2,
      message:
        name.length >= 2 ? "" : "Name must be at least 2 characters long",
    };
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    let validation: ValidationState = { isValid: true, message: "" };

    switch (field) {
      case "name":
        validation = validateName(value);
        break;
      case "email":
        validation = validateEmail(value);
        break;
      case "phone":
        validation = validatePhone(value);
        break;
      case "password":
        validation = validatePassword(value);
        if (formData.confirmPassword) {
          setValidationState((prev) => ({
            ...prev,
            confirmPassword: {
              isValid: value === formData.confirmPassword,
              message:
                value === formData.confirmPassword
                  ? ""
                  : "Passwords do not match",
            },
          }));
        }
        break;
      case "confirmPassword":
        validation = {
          isValid: value === formData.password,
          message: value === formData.password ? "" : "Passwords do not match",
        };
        break;
    }

    setValidationState((prev) => ({
      ...prev,
      [field]: validation,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    // Validate all fields
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhone(formData.phone);
    const passwordValidation = validatePassword(formData.password);
    const confirmPasswordValidation: ValidationState = {
      isValid: formData.password === formData.confirmPassword,
      message:
        formData.password === formData.confirmPassword
          ? ""
          : "Passwords do not match",
    };

    setValidationState({
      name: nameValidation,
      email: emailValidation,
      phone: phoneValidation,
      password: passwordValidation,
      confirmPassword: confirmPasswordValidation,
    });

    const isFormValid = [
      nameValidation,
      emailValidation,
      phoneValidation,
      passwordValidation,
      confirmPasswordValidation,
    ].every((field) => field.isValid);

    if (!isFormValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors.",
      });
      return;
    }

    const submitData = { ...formData };
    delete submitData.confirmPassword;

    try {
      const response = await add(submitData);

      console.log("response------------------------", response);

      if (response?.user) {
        setShowSuccess(true);
        toast({
          title: "Success",
          description: "Account created successfully!",
          variant: "default",
        });

        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        // If the user is already registered, check response details before throwing an error
        toast({
          variant: "destructive",
          title: "Registration Issue",
          description: response?.message || "User may already be registered.",
        });
      }
    } catch (err) {
      console.log("Error creating account:", err);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error?.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          {showSuccess && (
            <Alert className="mb-4 bg-green-50">
              <AlertDescription className="text-green-800">
                Account created successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {validationState.general?.message && (
            <Alert className="mb-4 bg-red-50">
              <AlertDescription className="text-red-800">
                {validationState.general.message}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Name", field: "name" as const, type: "text" },
              { label: "Email", field: "email" as const, type: "email" },
              { label: "Phone", field: "phone" as const, type: "tel" },
              {
                label: "Password",
                field: "password" as const,
                type: "password",
              },
              {
                label: "Confirm Password",
                field: "confirmPassword" as const,
                type: "password",
              },
            ].map(({ label, field, type }) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-medium">{label}</label>
                <Input
                  type={type}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className={
                    !validationState[field].isValid ? "border-red-500" : ""
                  }
                />
                {!validationState[field].isValid && (
                  <p className="text-sm text-red-500">
                    {validationState[field].message}
                  </p>
                )}
              </div>
            ))}

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

export default SignUp;
