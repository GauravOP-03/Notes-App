import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

const Error = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Floating Elements Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-200 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gray-300 rounded-full opacity-40 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-violet-100 rounded-full opacity-50 animate-pulse delay-500"></div>
        </div>

        {/* Main Error Card */}
        <div className="relative bg-white backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          {/* Decorative Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-gray-500 to-violet-500 rounded-2xl opacity-20 blur-sm"></div>
          <div className="absolute inset-[1px] bg-white rounded-2xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500 rounded-full blur-md opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-violet-500 to-violet-600 p-4 rounded-full shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-black to-gray-800 bg-clip-text text-transparent mb-3">
              Oops! Something went wrong
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, these things happen.
              Try refreshing the page or return to login.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="group relative overflow-hidden border-gray-300 hover:border-violet-400 hover:bg-violet-50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Try Again
              </Button>

              <Button
                onClick={() => navigate("/login")}
                className="group relative overflow-hidden bg-gradient-to-r from-gray-800 to-black hover:from-violet-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <Home className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>

            {/* Error Code */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-mono">
                ERROR_CODE: 500 | SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;