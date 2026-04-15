import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useStore } from '../lib/store';
import { loginUser } from '../lib/api';
import { Leaf } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, setOnboardingComplete } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await loginUser(email, password);
      login(user);
      setOnboardingComplete(true);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 md:p-10 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-olive flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-cream" />
            </div>
            <h1 className="font-display text-2xl font-bold text-charcoal mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-charcoal-muted">
              Sign in to continue your wellness journey
            </p>
          </div>

          {/* Google Sign-In */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <GoogleSignInButton text="signin_with" onError={(msg) => setError(msg)} />
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-sand/80" />
            <span className="text-xs text-charcoal-muted font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-sand/80" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button type="submit" loading={loading} className="w-full mt-2">
                Sign In
              </Button>
            </motion.div>
          </form>

          <p className="text-center text-sm text-charcoal-muted mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-olive font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </PageTransition>
  );
}

