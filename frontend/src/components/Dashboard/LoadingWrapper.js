import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

const LoadingWrapper = ({ wallet, children }) => {
  const { accountInfo } = wallet;
  if (!accountInfo)
    return (
      <Box
        flexGrow="1"
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="center">
        <CircularProgress />
      </Box>
    );
  return <>{children}</>;
};

export default LoadingWrapper;
