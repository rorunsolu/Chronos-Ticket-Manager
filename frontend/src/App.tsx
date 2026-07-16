import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Register from "@/pages/Register";
import "@/index.css";
import "@/App.css";
import { ApplicationShell1 } from "@/components/application-shell1";
import type { FunctionComponent } from "@/common/types";

const App = (): FunctionComponent => {
  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <ApplicationShell1>
        <Routes>
          <Route
            path="/register"
            element={<Register />}
          />
        </Routes>
      </ApplicationShell1>
    </ThemeProvider>
  );
};

export default App;
