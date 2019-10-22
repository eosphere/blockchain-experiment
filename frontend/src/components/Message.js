import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { MdError, MdCheckCircle } from 'react-icons/md';

const useStyles = makeStyles(theme => ({
  root: {
    fontWeight: 900,
    margin: `${theme.spacing(1)}px 0`,
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    color: 'white',
    borderRadius: '4px',
    alignItems: 'center'
  },
  error: { backgroundColor: theme.palette.error.dark },
  success: { backgroundColor: green[600] },
  icon: {
    width: '20px',
    height: '20px',
    marginRight: theme.spacing(1)
  }
}));

const Message = ({ type, message }) => {
  const classes = useStyles();
  return (
    <Box display="flex" className={`${classes.root} ${classes[type]}`}>
      {type === 'success' && <MdCheckCircle className={classes.icon} />}
      {type === 'error' && <MdError className={classes.icon} />}
      {message}
    </Box>
  );
};

export default Message;
