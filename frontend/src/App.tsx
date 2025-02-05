import Error from "./components/Notes/Error";
import Index from "./Pages/Index";
import MainPage from "./Pages/MainPage";
import RealtimeNotes from "./Pages/RealtimeNotes";
import LoginForm from "./components/User/Login";
import SignupForm from "./components/User/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
function App() {
  const router = createBrowserRouter([
    { path: "/", element: <MainPage /> },
    { path: "/notes", element: <Index /> },
    { path: "/signup", element: <SignupForm /> },
    { path: "/login", element: <LoginForm /> },
    { path: "/:id/notes", element: <RealtimeNotes /> },
    { path: "*", element: <Error /> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
