import "@/App.css";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { ThemeProvider } from "@/components/theme-provider";
import "@/index.css";
import Account from "@/pages/Account";
import Page from "@/app/dashboard/page";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import Tickets from "@/pages/Tickets";
import { Route, Routes } from "react-router-dom";
import type { FunctionComponent } from "@/common/types";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import { UserAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Ticket from "./pages/Ticket";

const App = (): FunctionComponent => {
  const { session } = UserAuth();

  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <Routes>
        <Route
          path="/landing"
          element={<Landing />}
        />
        <Route
          path="/signin"
          element={<LoginPage />}
        />
        <Route
          path="/signup"
          element={<SignupPage />}
        />

        <Route
          path="/ticket/:id"
          element={
            session ? (
              <AuthenticatedLayout>
                <Ticket />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/landing" />
            )
          }
        />

        <Route
          path="/"
          element={
            session ? (
              <AuthenticatedLayout>
                <Home />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/landing" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            session ? (
              <AuthenticatedLayout>
                <Page />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/landing" />
            )
          }
        />

        <Route
          path="/account"
          element={
            session ? (
              <AuthenticatedLayout>
                <Account session={session} />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/landing" />
            )
          }
        />

        <Route
          path="/tickets"
          element={
            session ? (
              <AuthenticatedLayout>
                <Tickets />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/landing" />
            )
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
