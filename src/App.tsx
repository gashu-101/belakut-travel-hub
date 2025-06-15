
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import Experiences from "./pages/Experiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import Auth from "./pages/Auth";
import AddHotel from "./pages/AddHotel";
import AddExperience from "./pages/AddExperience";
import ManageProperties from "./pages/ManageProperties";
import ManageExperiences from "./pages/ManageExperiences";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCallback from "./pages/PaymentCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="visitopia-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="hotels" element={<Hotels />} />
                <Route path="hotels/:id" element={<HotelDetail />} />
                <Route path="experiences" element={<Experiences />} />
                <Route path="experiences/:id" element={<ExperienceDetail />} />
                <Route path="auth" element={<Auth />} />
                <Route path="add-hotel" element={<AddHotel />} />
                <Route path="add-experience" element={<AddExperience />} />
                <Route path="manage-properties" element={<ManageProperties />} />
                <Route path="manage-experiences" element={<ManageExperiences />} />
                <Route path="payment/success" element={<PaymentSuccess />} />
                <Route path="payment/callback" element={<PaymentCallback />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
