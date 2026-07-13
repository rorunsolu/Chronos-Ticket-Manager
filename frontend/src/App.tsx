import "@mantine/core/styles.css";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  // Container,
  // Stack,
  // Group,
} from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/navbar/Navbar";
import Home from "./pages/Home";

import type { FunctionComponent } from "./common/types";

const App = (): FunctionComponent => {
  return (
    <AppShell padding="md">
      <AppShellMain>
        <AppShellHeader>
          <div className="flex justify-between items-center mt-auto mb-auto h-14 mx-4">
            <Navbar />
          </div>
        </AppShellHeader>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </AppShellMain>
    </AppShell>
  );
};

export default App;
