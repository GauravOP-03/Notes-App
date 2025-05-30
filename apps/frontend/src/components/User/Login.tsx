import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { loginUserSchema } from "zod-schemas/dist/schema";
import { ZodError } from "zod";
import GoogleLogin from "./GoogleLogin";
import { LogIn } from "lucide-react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  function onSignupClick() {
    navigate("/signup");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginUserSchema.parse(formData); // Validate form data
      setLoading(true);
      await axios.post(`${BACKEND_URL}/login`, formData, {
        withCredentials: true,
      });
      await login(); // Update auth context
      toast.success("Login Successful", {
        description: "Welcome back! Redirecting...",
      });
      navigate("/notes");
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<typeof formData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof formData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Login error:", error);
        toast.error("Login Failed", {
          description:
            axios.isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 p-4 relative overflow-hidden">
      <div className="w-full max-w-md z-10">
        <Card className="bg-white shadow-2xl rounded-xl border border-gray-200 text-gray-800">
          <CardHeader className="text-center p-6 md:p-8 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to continue to your dashboard.
            </p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 px-4 rounded-md shadow-sm"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 px-4 rounded-md shadow-sm"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base rounded-md transition-colors duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : <>
                    <LogIn size={18} /> Login Securely
                  </>}
                </Button>
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500 rounded-full">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin />
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              Don't have an account?{" "}
              <a
                onClick={onSignupClick}
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline cursor-pointer"
              >
                Sign up now
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
