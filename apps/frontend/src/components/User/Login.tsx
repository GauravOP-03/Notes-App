import { useCallback, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { loginUserSchema } from "zod-schemas/dist/schema";
import { ZodError } from "zod";
import UserCardHeader from "./userComponents/UserCardHeader";
import AuthInput from "./userComponents/AuthInput";
import SubmitButton from "./userComponents/SubmitButton";
import SocialLogin from "./userComponents/SocialLogin";
import AuthSwitch from "./userComponents/AuthSwitch";
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


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [formData, login, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 p-4 relative overflow-hidden">
      <div className="w-full max-w-md z-10">
        <Card className="bg-white shadow-2xl rounded-xl border border-gray-200 text-gray-800">

          <UserCardHeader
            heading="Welcome Back"
            content="Sign in to continue to your dashboard."
          />
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <AuthInput
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
                label="Email Address"
                className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 px-4 rounded-md shadow-sm"
              />

              <AuthInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password}
                label="Password"
                className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 px-4 rounded-md shadow-sm"
              />

              {/* <div> */}
              <SubmitButton loading={loading} text={"Login Securely"} loadingText={"Logging in..."} icon={useMemo(() => <LogIn size={18} />, [])} />
              {/* </div> */}
            </form>
            <SocialLogin />
            <AuthSwitch content={"Don't have an account?"} onSwitch={useCallback(() => navigate("/signup"), [navigate])} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
