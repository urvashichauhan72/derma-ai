import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '../lib/store';
import { Leaf, Menu, X, User, LogOut, History, LayoutDashboard, Stethoscope } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <div className="glass-strong rounded-2xl px-6 py-3 max-w-6xl mx-auto flex items-center justify-between">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-olive flex items-center justify-center">
                <Leaf className="w-4 h-4 text-cream" />
              </div>
              <span className="font-display text-lg font-semibold text-charcoal tracking-tight">
                Dermaïa
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
                  <NavLink to="/derma-chat" icon={<Stethoscope className="w-4 h-4" />} label="AI Derma" />
                  <NavLink to="/history" icon={<History className="w-4 h-4" />} label="History" />
                  <NavLink to="/profile" icon={<User className="w-4 h-4" />} label="Profile" />
                  <button
                    onClick={handleLogout}
                    className="ml-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-charcoal-muted hover:text-charcoal hover:bg-sand/40 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {isHome && (
                    <>
                      <Link
                        to="/login"
                        className="px-5 py-2 rounded-xl text-sm font-medium text-charcoal hover:bg-sand/40 transition-all duration-300"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-olive hover:bg-olive-dark transition-all duration-300"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-sand/40 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-4 right-4 z-50 glass-strong rounded-2xl p-4"
          >
            {isAuthenticated ? (
              <div className="flex flex-col gap-1">
                <MobileNavLink to="/dashboard" label="Dashboard" onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/derma-chat" label="AI Derma" onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/history" label="History" onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/profile" label="Profile" onClick={() => setMobileOpen(false)} />
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-3 rounded-xl text-sm text-charcoal-muted hover:bg-sand/40 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <MobileNavLink to="/login" label="Sign In" onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/signup" label="Get Started" onClick={() => setMobileOpen(false)} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
        active
          ? 'bg-olive/10 text-olive font-medium'
          : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/40'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="px-4 py-3 rounded-xl text-sm text-charcoal hover:bg-sand/40 transition-colors"
    >
      {label}
    </Link>
  );
}
