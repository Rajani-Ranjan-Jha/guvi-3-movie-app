'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      // Map NextAuth error codes to user-friendly messages
      const errorMessages = {
        'CredentialsSignin': 'Invalid email or password',
        'OAuthSignin': 'Error signing in with provider',
        'OAuthCallback': 'Error completing OAuth sign in',
        'OAuthCreateAccount': 'Error creating account with provider',
        'EmailCreateAccount': 'Error creating account with email',
        'Callback': 'Error in authentication callback',
        'OAuthAccountNotLinked': 'Email already associated with another account',
        'EmailSignin': 'Error sending verification email',
        'CredentialsSignin': 'Invalid credentials',
        'SessionRequired': 'Please sign in to access this page',
        'Default': 'An authentication error occurred'
      };
      
      setError(errorMessages[errorParam] || errorMessages['Default']);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
          {error && (
            <p className="text-white mb-6">{error}</p>
          )}
          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
