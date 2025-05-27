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
import { loginUserSchema } from "zod-schemas/dist/schema"; // Ensure this path is correct
import { ZodError } from "zod";
import GoogleLogin from "./GoogleLogin"; // Ensure this path is correct
import { motion } from "motion/react";
import { LogIn } from 'lucide-react';

// Variants for Framer Motion animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

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
      await axios.post(
        `${BACKEND_URL}/login`,
        formData,
        { withCredentials: true }
      );
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

      {/* Subtle Animated Background Shapes - Light Theme */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full opacity-20 filter blur-3xl"
        animate={{
          scale: [1, 1.05, 1.02, 1.07, 1],
          rotate: [0, 5, -3, 7, 0],
        }}
        transition={{
          duration: 30, // Slower, more subtle movement
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-200 rounded-full opacity-15 filter blur-3xl"
        animate={{
          scale: [1, 1.08, 1.03, 1.06, 1],
          rotate: [0, -5, 4, -6, 0],
        }}
        transition={{
          duration: 35, // Slower, more subtle movement
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10" // Ensure card is above shapes
      >
        <Card className="bg-white shadow-2xl rounded-xl border border-gray-200 text-gray-800">
          <CardHeader className="text-center p-6 md:p-8 border-b border-gray-200">
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"
            >
              Welcome Back
            </motion.h1>
            <motion.p variants={itemVariants} className="text-sm text-gray-500 mt-2">
              Sign in to continue to your dashboard.
            </motion.p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
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
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="password"
                  className="text-gray-700 font-medium"
                >
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
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base rounded-md transition-colors duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    "Logging in..."
                  ) : (
                    <>
                      <LogIn size={18} /> Login Securely
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              variants={itemVariants}
              className="relative my-8" // Increased margin for better separation
            >
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500 rounded-full"> {/* bg-white ensures it covers the line */}
                  Or continue with
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center">
              {/* Ensure GoogleLogin component fits this lighter theme */}
              <GoogleLogin />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-gray-500 mt-8" // Increased margin
            >
              Don't have an account?{" "}
              <a
                onClick={onSignupClick}
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Sign up now
              </a>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}