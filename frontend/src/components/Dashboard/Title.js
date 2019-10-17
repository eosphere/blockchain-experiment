import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

export default function Title(props) {
  return (
    <Typography
      className={props.className}
      component="h1"
      variant="h5"
      color="primary"
      gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node
};
