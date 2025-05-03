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
export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const { toast } = useToast();

  function onSignupClick() {
    navigate("/signup");
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(`${BACKEND_URL}/login`, formData)
      .then((res) => {
        const { token, userData } = res.data;
        console.log(userData);
        localStorage.setItem("token", token);
        login(userData);

        navigate("/notes");
        toast({
          description: "Login Successfully",
        });
      })
      .catch((e) => {
        console.error(e);
        toast({
          description: e.response.data.message,
        });
      });
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
            </div>
            <Button type="submit" className="w-full">
              Login
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
