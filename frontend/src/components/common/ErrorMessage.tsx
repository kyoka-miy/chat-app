import React from 'react';

type Props = {
  errorMessage: string;
};

export const ErrorMessage: React.FC<Props> = ({ errorMessage }) => {
  return <div className="text-red-500 text-sm mb-2">{errorMessage}</div>;
};
