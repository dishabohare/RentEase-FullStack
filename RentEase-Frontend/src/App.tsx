import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ExplorePage from "./pages/ExplorePage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import TenantDashboard from "./pages/TenantDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddPropertyPage from "./pages/AddPropertyPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* AuthProvider must be inside BrowserRouter so useNavigate works */}
        <AuthProvider>
          <Routes>
            {/* ── PUBLIC ROUTES ── */}
            <Route path="/"          element={<LandingPage />} />
            <Route path="/login"     element={<AuthPage mode="login" />} />
            <Route path="/signup"    element={<AuthPage mode="signup" />} />
            <Route path="/explore"   element={<ExplorePage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />

            {/* ── TENANT PROTECTED ── */}
            <Route
              path="/tenant-dashboard"
              element={
                <ProtectedRoute allowedRoles={["TENANT"]}>
                  <TenantDashboard />
                </ProtectedRoute>
              }
            />

            {/* ── OWNER PROTECTED ── */}
            <Route
              path="/owner-dashboard"
              element={
                <ProtectedRoute allowedRoles={["OWNER"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-property"
              element={
                <ProtectedRoute allowedRoles={["OWNER"]}>
                  <AddPropertyPage />
                </ProtectedRoute>
              }
            />

            {/* ── ANY LOGGED-IN USER ── */}
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* ── ADMIN ONLY ── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
