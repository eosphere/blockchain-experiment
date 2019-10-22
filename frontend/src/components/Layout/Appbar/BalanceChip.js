import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: 'white',
    fontWeight: 900,
    borderColor: 'white'
  }
}));

const BalanceChip = ({ type, value, icon }) => {
  const classes = useStyles();
  if (!value) return null;
  const prefix = value.includes('AUD') && '$';
  const label = `${prefix || ''} ${value}`;
  return (
    <Chip className={classes.root} color="secondary" variant="outlined" icon={icon} label={label} />
  );
};

export default BalanceChip;
