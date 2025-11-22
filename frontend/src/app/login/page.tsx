'use client';
import { CONSTANTS } from '@/utils/constants';
import { auth } from '../../utils/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await fetch(CONSTANTS.ENDPOINT.AUTH_LOGIN, {
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
      console.error('Failed to login with Google:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-colors cursor-pointer mb-4"
        >
          Login with Google
        </button>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
