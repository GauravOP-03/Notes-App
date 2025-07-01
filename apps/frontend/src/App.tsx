import { lazy } from "react";
const Error = lazy(() => import("./components/Error"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const MainPage = lazy(() => import("./pages/NoteNestLanding"));
const RealTimeTextEditor = lazy(() => import("./components/notes/collaborative/RealTimeTextEditor"));
const LoginForm = lazy(() => import("./components/User/Login"));
const SignupForm = lazy(() => import("./components/User/SignUp"));
const SharedNotePage = lazy(() => import("./components/notes/SharedNotePage"));
const ForgetPassword = lazy(() => import("./components/User/ForgetPassword"));
const ResetPassword = lazy(() => import("./components/User/ResetPassword"));

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import LoginRoute from "./routes/LoginRoute"
import { Toaster } from "sonner";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <MainPage />

      ),
    },
    { path: "/notes", element: <PrivateRoute><NotesPage /> </PrivateRoute> },
    { path: "/signup", element: <LoginRoute><SignupForm /></LoginRoute> },
    { path: "/login", element: <LoginRoute><LoginForm /></LoginRoute> },
    { path: "/forget-password", element: <ForgetPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    {
      path: "/:id/notes",
      element: (
        <PrivateRoute>
          <RealTimeTextEditor />
        </PrivateRoute>
      ),
    },
    { path: "/shared/:sharedId", element: <SharedNotePage /> },
    { path: "*", element: <Error /> },
  ]);
  return (
    <AuthProvider>
      <NotesProvider>
        <Toaster richColors closeButton position="top-center" />
        <RouterProvider router={router} />
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;
