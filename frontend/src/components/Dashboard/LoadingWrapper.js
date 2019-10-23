import React from 'react';
import Loading from 'components/Loading';

const LoadingWrapper = ({ wallet, children }) => {
  const { accountInfo } = wallet;
  if (!accountInfo) return <Loading />;
  return <>{children}</>;
};

export default LoadingWrapper;
