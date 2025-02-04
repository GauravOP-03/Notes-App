import Error from "./components/Notes/Error";
import Index from "./components/Notes/Index";
import MainPage from "./components/Notes/MainPage";
import LoginForm from "./components/User/Login";
import SignupForm from "./components/User/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
function App() {
  const router = createBrowserRouter([
    { path: "/", element: <MainPage /> },
    { path: "/notes", element: <Index /> },
    { path: "/signup", element: <SignupForm /> },
    { path: "/login", element: <LoginForm /> },

    { path: "*", element: <Error /> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
