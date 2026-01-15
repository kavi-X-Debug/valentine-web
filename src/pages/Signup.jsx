import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanedEmail = email.trim();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(cleanedEmail, password, { displayName: name });
      navigate('/profile');
    } catch (error) {
      console.error("Signup error:", error);
      let msg = 'Failed to create an account';
      if (error.code === 'auth/email-already-in-use') msg = 'Email is already in use';
      if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters';
      if (error.code === 'auth/invalid-email') msg = 'Invalid email address';
      if (error.code === 'auth/operation-not-allowed') msg = 'Email/Password accounts are not enabled in Firebase Console.';
      
      // Fallback: append the actual error code for debugging
      if (msg === 'Failed to create an account') {
        msg += `: ${error.message} (${error.code})`;
      }
      setError(msg);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/profile');
    } catch (error) {
      console.error("Google login error:", error);
      let msg = 'Failed to sign up with Google';
      if (error.code === 'auth/popup-closed-by-user') msg = 'Google sign-up was closed before completing.';
      if (error.code === 'auth/popup-blocked-by-browser') msg = 'Your browser blocked the Google sign-up popup.';
      if (error.code === 'auth/cancelled-popup-request') msg = 'Google sign-up was cancelled by another request.';
      if (error.code === 'auth/unauthorized-domain') msg = 'Google sign-up is not enabled for this website domain.';
      if (msg === 'Failed to sign up with Google' && error.code) {
        msg += ` (${error.code})`;
      }
      setError(msg);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-love-light/30 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20">
        <div className="text-center mb-8">
          <Heart className="h-10 w-10 text-love-red mx-auto mb-2 fill-current" />
          <h2 className="text-3xl font-cursive text-love-dark font-bold">Create Account</h2>
          <p className="text-gray-600">Join our community of love</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-love-red focus:ring-love-red p-2 border"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-love-red focus:ring-love-red p-2 border"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-love-red text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-love-red transition-colors font-medium"
          >
            Sign Up
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
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-love-red hover:underline font-medium">Log in</Link>
        </div>
      </div>
    </div>
  );
}
