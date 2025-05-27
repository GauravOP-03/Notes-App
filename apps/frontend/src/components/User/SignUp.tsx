import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from 'sonner'
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config"; // User's specified path
import { registerUserSchema } from "@/types/schema"; // Ensure this path is correct
import { ZodError } from "zod";
import { motion } from "motion/react";
import { UserPlus } from 'lucide-react'; // Icon for signup button
import GoogleLogin from "./GoogleLogin";

// Variants for Framer Motion animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Slightly faster stagger for more fields
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

    // Clear error for the field being changed
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // If changing password or confirmPassword, also clear confirmPassword error if they now match
    if ((name === "password" || name === "confirmPassword") && formData.password === formData.confirmPassword) {
      if (name === "password" && value === formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
      if (name === "confirmPassword" && value === formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Manual check for password confirmation before Zod, for better UX
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    try {
      // Validate all fields with Zod
      registerUserSchema.parse(formData);
      setLoading(true);

      // Make API call
      await axios.post(`${BACKEND_URL}/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Account Created!", {
        description: "Your account has been successfully created. Please login to continue.",
        // Consider a success variant for toast if available/configured
      });
      navigate("/login"); // Redirect to login page

    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<typeof formData> = {};
        error.errors.forEach((err) => {
          // err.path can be an array for nested objects, ensure it's not empty
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof typeof formData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(error) && error.response) {
        // Handle backend errors (e.g., email already exists)
        toast.error("Signup Failed", {
          description: error.response.data?.message || "An error occurred on the server.",
        });
      } else {
        // Handle other unexpected errors
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

    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 p-4 relative overflow-hidden">

      {/* Subtle Animated Background Shapes - Light Theme */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 md:w-72 md:h-72 bg-blue-300 rounded-full opacity-20 filter blur-3xl"
        animate={{
          scale: [1, 1.05, 1.02, 1.07, 1],
          rotate: [0, 5, -3, 7, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-80 md:h-80 bg-green-200 rounded-full opacity-15 filter blur-3xl"
        animate={{
          scale: [1, 1.08, 1.03, 1.06, 1],
          rotate: [0, -5, 4, -6, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10" // Ensures card is above shapes
      >
        <Card className="bg-white shadow-2xl rounded-xl border border-gray-200 text-gray-800">
          <CardHeader className="text-center p-6 md:p-8 border-b border-gray-200">
            <motion.h1
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"
            >
              Create Your Account
            </motion.h1>
            <motion.p variants={itemVariants} className="text-sm text-gray-500 mt-2">
              Join us and start your journey!
            </motion.p>
          </CardHeader>
          <CardContent className="p-6 md:p-8 ">
            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-5" // Slightly reduced space for more fields
            >
              <motion.div variants={itemVariants} >
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Username
                </Label>
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
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  className="mt-1 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11 px-4 rounded-md shadow-sm"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-medium"
                >
                  Confirm Password
                </Label>
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
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base rounded-md transition-colors duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      <UserPlus size={18} /> Create Account
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
              className="text-center text-sm text-gray-500 mt-6" // Adjusted margin
            >
              Already have an account?{" "}
              <span // Changed to span for better semantics, onClick handles navigation
                onClick={() => navigate("/login")}
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline cursor-pointer"
              >
                Login
              </span>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>

  );
}
