import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/Dashboard";
import Projection from "./pages/Projection";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {(typeof window !== 'undefined' && (window.location.protocol === 'file:' || (window as any).Capacitor || import.meta.env.BASE_URL !== '/')) ? (
          <HashRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projection" element={<PrivateProjection><Projection /></PrivateProjection>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projection" element={<PrivateProjection><Projection /></PrivateProjection>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

function PrivateProjection({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const authed = typeof window !== "undefined" && localStorage.getItem("projectionAuth") === "true";
  if (!authed) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
