import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword, getSignInMethods } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanedEmail = email.trim();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      const methods = await getSignInMethods(cleanedEmail);
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
      await resetPassword(cleanedEmail);
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
          <h2 className="text-3xl font-cursive text-love-dark font-bold">Reset Password</h2>
          <p className="text-gray-600">Enter your email to receive a reset link</p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}
        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="status"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-love-red focus:ring-love-red p-2 border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-love-red text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-love-red transition-colors font-medium"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Remember your password? </span>
          <Link to="/login" className="text-love-red hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

