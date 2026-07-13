import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { theme } from "./theme";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root") as HTMLElement;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <App />
          </MantineProvider>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}
