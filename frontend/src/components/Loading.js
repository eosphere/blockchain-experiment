import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

const Loading = () => (
  <Box
    flexGrow="1"
    display="flex"
    alignItems="center"
    flexDirection="column"
    justifyContent="center">
    <CircularProgress />
  </Box>
);

export default Loading;
