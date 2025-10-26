'use client';
import { auth } from '../../utils/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CONSTANTS } from '@/utils/constants';

const SignUpPage = () => {
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await fetch(CONSTANTS.ENDPOINT.AUTH_SIGNUP, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, refreshToken: user.refreshToken }),
      });

      if (response.ok) {
        router.push(CONSTANTS.LINK.HOME);
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Failed to sign up with Google:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Sign Up
        </h1>
        <button
          onClick={handleGoogleSignUp}
          className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition-colors cursor-pointer mb-4"
        >
          Sign up with Google
        </button>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
