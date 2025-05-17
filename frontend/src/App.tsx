import { lazy } from "react";
const Error = lazy(() => import("./components/Error"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const MainPage = lazy(() => import("./pages/MainPage"));
const RealtimeNotes = lazy(() => import("./pages/RealtimeNotes"));
const LoginForm = lazy(() => import("./components/User/Login"));
const SignupForm = lazy(() => import("./components/User/SignUp"));
const SharedNotePage = lazy(() => import("./components/notes/SharedNotePage"));


import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import { Toaster } from "sonner";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <MainPage />

      ),
    },
    { path: "/notes", element: <NotesPage /> },
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
