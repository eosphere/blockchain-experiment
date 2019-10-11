import React from 'react';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { toNumber } from '../../utils';

const Deposits = ({ wallet }) => {
  const { accountInfo } = wallet;
  return (
    <React.Fragment>
      <Title>Total Balance</Title>
      <Typography component="p" variant="h4">
        <strong>{toNumber(accountInfo.core_liquid_balance).toFixed(4)} </strong>
        <small>EOS</small>
      </Typography>
    </React.Fragment>
  );
};

export default Deposits;
