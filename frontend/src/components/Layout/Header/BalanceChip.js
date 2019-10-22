import React from 'react';
import { MdAccountBalance, MdAccountBalanceWallet } from 'react-icons/md';
import { Chip, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: 'white',
    fontWeight: 900,
    borderColor: 'white'
  },
  icon: {
    width: '20px',
    height: '20px'
  }
}));

const BalanceChip = ({ type, funds }) => {
  const classes = useStyles();
  if (!funds) return null;
  const icon =
    type === 'wallet' ? (
      <MdAccountBalanceWallet className={classes.icon} />
    ) : (
      <MdAccountBalance className={classes.icon} />
    );
  const prefix = funds.includes('AUD') && '$';
  const label = `${prefix} ${funds}`;
  return (
    <Chip className={classes.root} color="secondary" variant="outlined" icon={icon} label={label} />
  );
};

export default BalanceChip;
