import React from 'react';
import { Box, Link, makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { MdError, MdCheckCircle } from 'react-icons/md';
import { NETWORK_HOST, SYSTEM_DOMAIN, CORE_SYMBOL } from 'utils';

const useStyles = makeStyles(theme => ({
  root: {
    fontWeight: 900,
    margin: `${theme.spacing(1)}px 0`,
    padding: theme.spacing(2),
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
  },
  link: {
    fontWeight: 900,
    marginLeft: '3px',
    color: 'white',
    textDecoration: 'underline'
  }
}));

const buildTransactionUrl = transactionId => {
  return `https://local.bloks.io/transaction/${transactionId}?nodeUrl=${NETWORK_HOST}&coreSymbol=${CORE_SYMBOL}&systemDomain=${SYSTEM_DOMAIN}`;
};

const transactionLabel = 'View Transaction';

const Message = ({ type, message, transactionId }) => {
  const classes = useStyles();
  return (
    <Box
      component="span"
      display="inline-flex"
      flexWrap="wrap"
      className={`${classes.root} ${classes[type]}`}>
      {type === 'success' && <MdCheckCircle className={classes.icon} />}
      {type === 'error' && <MdError className={classes.icon} />}
      {message}
      {transactionId && (
        <Link
          href={buildTransactionUrl(transactionId)}
          target="_blank"
          rel="noreferrer noopener"
          className={classes.link}>
          {transactionLabel}
        </Link>
      )}
    </Box>
  );
};

export default Message;
