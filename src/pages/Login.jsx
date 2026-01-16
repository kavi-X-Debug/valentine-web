import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState(''); // user email input
  const [password, setPassword] = useState(''); // user password input
  const [error, setError] = useState(''); // error message to show in UI
  const [message, setMessage] = useState(''); // success / info message
  const [loading, setLoading] = useState(false); // prevents duplicate actions
  const { login, loginWithGoogle, resetPassword, getSignInMethods } = useAuth(); // auth helpers from context
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanedEmail = email.trim(); // normalize email input
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await login(cleanedEmail, password);
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      let msg = 'Failed to log in';
      if (error.code === 'auth/wrong-password') msg = 'Incorrect password';
      if (error.code === 'auth/user-not-found') msg = 'No account found with this email';
      if (error.code === 'auth/invalid-email') msg = 'Invalid email address';
      if (error.code === 'auth/invalid-credential') msg = 'Invalid credentials';
      setError(msg);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Google login error:", error);
      let msg = 'Failed to log in with Google';
      if (error.code === 'auth/popup-closed-by-user') msg = 'Google sign-in was closed before completing.';
      if (error.code === 'auth/popup-blocked-by-browser') msg = 'Your browser blocked the Google sign-in popup.';
      if (error.code === 'auth/cancelled-popup-request') msg = 'Google sign-in was cancelled by another request.';
      if (error.code === 'auth/unauthorized-domain') msg = 'Google sign-in is not enabled for this website domain.';
      if (msg === 'Failed to log in with Google' && error.code) {
        msg += ` (${error.code})`;
      }
      setError(msg);
    }
    setLoading(false);
  }

  async function handleForgotPassword() {
    const cleanedEmail = email.trim(); // normalize email before using it
    if (!cleanedEmail) {
      setError('Please enter your email to reset your password');
      return;
    }
    try {
      setError('');
      setMessage('');
      setLoading(true);
      const methods = await getSignInMethods(cleanedEmail); // check how this user signs in
      if (!methods || methods.length === 0) {
        setError('No account found with this email');
        setLoading(false);
        return;
      }
      if (!methods.includes('password')) {
        setError('This account uses Google sign-in. Please sign in with Google.');
        setLoading(false);
        return;
      }
      await resetPassword(cleanedEmail); // call Firebase sendPasswordResetEmail via AuthContext
      setMessage('Password reset email sent. Please check your inbox and spam folder.');
    } catch (error) {
      let msg = 'Failed to send password reset email';
      if (error.code === 'auth/user-not-found') msg = 'No account found with this email';
      if (error.code === 'auth/invalid-email') msg = 'Invalid email address';
      setError(msg);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-love-light/30 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20">
        <div className="text-center mb-8">
          <Heart className="h-10 w-10 text-love-red mx-auto mb-2 fill-current" />
          <h2 className="text-3xl font-cursive text-love-dark font-bold">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your love story</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="status">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-love-red focus:ring-love-red p-2 border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-love-red focus:ring-love-red p-2 border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="text-sm text-love-red hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-love-red text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-love-red transition-colors font-medium"
          >
            Log In
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-love-red"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="text-love-red hover:underline font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
