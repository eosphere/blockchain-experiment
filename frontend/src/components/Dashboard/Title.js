import React from 'react';
import { Typography } from '@material-ui/core';

const Title = ({ className, children }) => (
  <Typography className={className} component="h1" variant="h5" color="primary" gutterBottom>
    {children}
  </Typography>
);

export default Title;
