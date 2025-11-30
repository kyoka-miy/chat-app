import { useState } from 'react';

export const usePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const post = async (url: string, body: any) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to post data');
    } finally {
      setIsLoading(false);
    }
  };
  return { post, isLoading, errorMessage };
};
