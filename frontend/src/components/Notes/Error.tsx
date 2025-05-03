import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md p-6 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Some Error Occurred
        </h2>
        <p className="text-gray-500 mt-2">
          Please try again or go back to login.
        </p>
        <Button onClick={() => navigate("/login")} className="mt-4">
          Go to Login
        </Button>
      </div>
    </div>
  );
};

export default Error;
