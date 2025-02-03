import Index from "./components/Notes/Index";
import LoginForm from "./components/User/Login";
import SignupForm from "./components/User/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
function App() {
  const router = createBrowserRouter([
    { path: "/", element: <div>home</div> },
    { path: "/notes", element: <Index /> },
    { path: "/signup", element: <SignupForm /> },
    { path: "/login", element: <LoginForm /> },

    { path: "*", element: <div>Nothing exist</div> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
