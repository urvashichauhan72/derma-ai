import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';

// Decode Google JWT credential to extract user info
function decodeJwt(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface GoogleSignInButtonProps {
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  onError?: (message: string) => void;
}

export default function GoogleSignInButton({ text = 'signin_with', onError }: GoogleSignInButtonProps) {
  const btnRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { login, setOnboardingComplete } = useStore();

  const handleCredentialResponse = useCallback(
    (response: GoogleCredentialResponse) => {
      const payload = decodeJwt(response.credential);
      const user = {
        id: (payload.sub as string) || '1',
        name: (payload.name as string) || 'User',
        email: (payload.email as string) || '',
        age: 0,
        gender: '',
        skinType: '',
        dietPreference: '',
      };
      login(user);
      setOnboardingComplete(true);
      navigate('/dashboard');
    },
    [login, setOnboardingComplete, navigate]
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In will not work.');
      return;
    }

    // Wait for the Google script to load
    const initGoogle = () => {
      if (!window.google?.accounts?.id || !btnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(btnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text,
        shape: 'pill',
        width: btnRef.current.offsetWidth,
      });
    };

    // If google is already loaded, initialize immediately
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      // Otherwise, poll until it's ready (script is async)
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);
      // Stop after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!window.google?.accounts?.id) {
          onError?.('Google Sign-In failed to load. Please try again later.');
        }
      }, 10000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [handleCredentialResponse, text, onError]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        onClick={() => onError?.('Google Sign-In is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.')}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border-2 border-sand/60 bg-white hover:bg-cream-dark transition-all duration-300 cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span className="text-sm font-medium text-charcoal">Sign in with Google</span>
      </button>
    );
  }

  return <div ref={btnRef} className="w-full" />;
}
