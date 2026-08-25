import "@/App.css";
// import { ApplicationShell1 } from "@/components/application-shell1";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { ThemeProvider } from "@/components/theme-provider";
import "@/index.css";
import AccountPage from "@/pages/AccountPage";
// import Dashboard from "@/pages/Dashboard";
import Page from "@/app/dashboard/page";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import TicketPage from "@/pages/TicketPage";
import { Route, Routes } from "react-router-dom";
import type { FunctionComponent } from "@/common/types";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import { UserAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

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
          path="/"
          element={<Home />}
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
                <AccountPage session={session} />
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
                <TicketPage />
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
