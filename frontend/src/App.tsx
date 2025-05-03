import { lazy } from "react";
const Error = lazy(() => import("./components/Notes/Error"));
const Index = lazy(() => import("./pages/Index"));
const MainPage = lazy(() => import("./pages/MainPage"));
const RealtimeNotes = lazy(() => import("./pages/RealtimeNotes"));
const LoginForm = lazy(() => import("./components/User/Login"));
const SignupForm = lazy(() => import("./components/User/SignUp"));

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <MainPage />
        </PrivateRoute>
      ),
    },
    { path: "/notes", element: <Index /> },
    { path: "/signup", element: <SignupForm /> },
    { path: "/login", element: <LoginForm /> },
    {
      path: "/:id/notes",
      element: (
        <PrivateRoute>
          <RealtimeNotes />
        </PrivateRoute>
      ),
    },
    { path: "*", element: <Error /> },
  ]);
  return (
    <AuthProvider>
      <NotesProvider>
        <RouterProvider router={router} />
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;
