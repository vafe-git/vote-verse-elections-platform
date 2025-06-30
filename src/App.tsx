
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import VotingBooth from "./pages/VotingBooth";
import Results from "./pages/Results";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateRegistration from "./pages/CandidateRegistration";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { VotingProvider } from "./contexts/VotingContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <VotingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/vote" element={<VotingBooth />} />
              <Route path="/results" element={<Results />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/register-candidate" element={<CandidateRegistration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </VotingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
