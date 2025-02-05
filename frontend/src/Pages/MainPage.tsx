import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Notes App
        </h1>
        <p className="text-gray-600 mt-2">Your notes, always with you.</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate("/login")}
            className="px-6 py-2 text-lg"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            variant="outline"
            className="px-6 py-2 text-lg"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
