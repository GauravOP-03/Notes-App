import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form submitted", formData);

    axios
      .post(`${BACKEND_URL}/signup`, formData)
      .then((d) => {
        console.log(d.status);

        toast({
          description: "Account Created Successfully, Login to Continue",
        });

        navigate("/login");
      })
      .catch((e) => {
        console.error(e);
        toast({
          description: e.response.data.message,
        });
      });

    // Add signup logic here
  };

  function onLoginClick() {
    navigate("/login");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster />
      <Card className="w-96 shadow-lg">
        <CardHeader className="text-center text-lg font-semibold">
          Sign Up
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="name"
                name="username"
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
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
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have account?{" "}
            <a
              onClick={onLoginClick}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
