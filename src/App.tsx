import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Processing from './pages/Processing';
import Results from './pages/Results';
import History from './pages/History';
import Profile from './pages/Profile';
import DermaChat from './pages/DermaChat';
import { useStore } from './lib/store';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <OnboardingGuard>
              <Dashboard />
            </OnboardingGuard>
          }
        />
        <Route
          path="/analysis"
          element={
            <OnboardingGuard>
              <Analysis />
            </OnboardingGuard>
          }
        />
        <Route
          path="/processing"
          element={
            <OnboardingGuard>
              <Processing />
            </OnboardingGuard>
          }
        />
        <Route
          path="/results"
          element={
            <OnboardingGuard>
              <Results />
            </OnboardingGuard>
          }
        />
        <Route
          path="/history"
          element={
            <OnboardingGuard>
              <History />
            </OnboardingGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <OnboardingGuard>
              <Profile />
            </OnboardingGuard>
          }
        />
        <Route
          path="/derma-chat"
          element={
            <OnboardingGuard>
              <DermaChat />
            </OnboardingGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Background />
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
