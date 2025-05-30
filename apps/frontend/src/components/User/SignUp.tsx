import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import axios from "axios";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import { registerUserSchema } from "zod-schemas/dist/schema";
import { ZodError } from "zod";
import { UserPlus } from 'lucide-react';
import AuthInput from "./userComponents/AuthInput";
import SocialLogin from "./userComponents/SocialLogin";
import SubmitButton from "./userComponents/SubmitButton";
import UserCardHeader from "./userComponents/UserCardHeader";
import AuthSwitch from "./userComponents/AuthSwitch";

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

          <UserCardHeader heading="Create Your Account" content="Join us and start your journey!" />

          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthInput id="username" name="username" type="text" value={formData.username} onChange={handleChange} placeholder="Choose a username" required error={errors.username} label="Username" className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 rounded-md shadow-sm" />

              <AuthInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required error={errors.email} label="Email Address" className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 rounded-md shadow-sm" />

              <AuthInput id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required error={errors.password} label="Password" className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 rounded-md shadow-sm" />

              <AuthInput id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" required error={errors.confirmPassword} label="Confirm Password" className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 rounded-md shadow-sm" />

              <div className="pt-2">
                <SubmitButton loading={loading} icon={<UserPlus size={18} />} text={"Create Account"} loadingText={"Creating Account..."} />
              </div>
            </form>

            <SocialLogin />

            <AuthSwitch onSwitch={() => navigate("/login")} content="Already have an account?" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
