import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { loginUserSchema } from "@/types/schema";
import { ZodError } from "zod";
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
  const { toast } = useToast();

  function onSignupClick() {
    navigate("/signup");
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form submitted", formData);
    // Validate form data using Zod schema
    try {
      loginUserSchema.parse({
        email: formData.email,
        password: formData.password,
      });
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/login`, { email: formData.email, password: formData.password })
      const { token, userData } = res.data;
      console.log(userData);
      localStorage.setItem("token", token);
      login(userData);

      navigate("/notes");
      toast({
        description: "Login Successfully",
      });
    } catch (e) {
      if (e instanceof ZodError) {
        const fieldErrors: Partial<typeof formData> = {};
        e.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof formData] = err.message;
          }
        })
        setErrors(fieldErrors);
        console.log(fieldErrors)
      } else {

        console.error(e);
        toast({
          description: axios.isAxiosError(e) && e.response?.data?.message
          ? e.response.data.message
          : "Login failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster />
      <Card className="w-96 shadow-lg">
        <CardHeader className="text-center text-lg font-semibold">
          Login
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          {/* Signup Link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <a
              onClick={onSignupClick}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
