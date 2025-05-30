import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import { registerUserSchema } from "zod-schemas/dist/schema";
import { ZodError } from "zod";
import { UserPlus } from 'lucide-react';
import GoogleLogin from "./GoogleLogin";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // if ((name === "password" || name === "confirmPassword") && formData.password === formData.confirmPassword) {
    //   if (name === "password" && value === formData.confirmPassword) {
    //     setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    //   }
    //   if (name === "confirmPassword" && value === formData.password) {
    //     setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    //   }
    // }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    try {
      registerUserSchema.parse(formData);
      setLoading(true);

      await axios.post(`${BACKEND_URL}/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }, { withCredentials: true });

      toast.success("Account Created!", {
        description: "Your account has been successfully created. ",
      });
      navigate("/notes");

    } catch (error) {
      // console.log(error)
      if (error instanceof ZodError) {
        const fieldErrors: Partial<typeof formData> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof typeof formData] = err.message;
          }
        });
        // console.log(fieldErrors)
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(error) && error.response) {
        toast.error("Signup Failed", {
          description: error.response.data?.message || "An error occurred on the server.",
        });
      } else {
        toast.error("Signup Failed", {
          description: "An unexpected error occurred. Please try again.",
        });
        console.error("Signup error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-2xl rounded-xl border border-gray-200 text-gray-800">
          <CardHeader className="text-center p-6 md:p-8 border-b border-gray-200">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Join us and start your journey!
            </p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 rounded-md shadow-sm"
                />
                {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 rounded-md shadow-sm"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 rounded-md shadow-sm"
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 rounded-md shadow-sm"
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base rounded-md transition-colors duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : (<><UserPlus size={18} /> Create Account</>)}
                </Button>
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500 rounded-full">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin />
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
