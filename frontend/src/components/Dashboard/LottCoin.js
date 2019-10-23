import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const LottCoin = ({ width = '45px', noMargin = false }) => {
  const classes = useStyles();
  const className = !noMargin ? classes.icon : '';
  return <img alt="Lott Coin" className={className} width={width} src="/lott-logo.png" />;
};

export default LottCoin;
