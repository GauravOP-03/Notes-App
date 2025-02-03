import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function LoginForm() {
  const [formData, setFormData] = useState({
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/login", formData)
      .then((res) => {
        console.log(res);

        const { token, userId } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        toast({
          description: "Login Successfully",
        });

        navigate("/notes");
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
        </CardContent>
      </Card>
    </div>
  );
}
