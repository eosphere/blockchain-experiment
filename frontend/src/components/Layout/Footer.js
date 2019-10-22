import React from 'react';
import { Typography, Link } from '@material-ui/core';

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://www.thelott.com/">
      Golden Casket Lottery Corporation Limited
    </Link>
  </Typography>
);

export default Copyright;
