import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Challenges from "./pages/Challenges";
import Games from "./pages/Games";
import Family from "./pages/Family";
import Rewards from "./pages/Rewards";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MobileLayout>
                  <Index />
                </MobileLayout>
              </ProtectedRoute>
            } />
            <Route path="/challenges" element={
              <ProtectedRoute>
                <MobileLayout>
                  <Challenges />
                </MobileLayout>
              </ProtectedRoute>
            } />
            <Route path="/games" element={
              <ProtectedRoute>
                <MobileLayout>
                  <Games />
                </MobileLayout>
              </ProtectedRoute>
            } />
            <Route path="/family" element={
              <ProtectedRoute>
                <MobileLayout>
                  <Family />
                </MobileLayout>
              </ProtectedRoute>
            } />
            <Route path="/rewards" element={
              <ProtectedRoute>
                <MobileLayout>
                  <Rewards />
                </MobileLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
