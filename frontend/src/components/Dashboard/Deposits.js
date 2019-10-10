import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { toNumber } from '../../utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const Deposits = ({ wallet }) => {
  const { accountInfo } = wallet;
  if (!accountInfo)
    return (
      <Box
        flexGrow="1"
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="center">
        <CircularProgress />
      </Box>
    );
  console.log(accountInfo);
  return (
    <React.Fragment>
      <Title>Total Balance</Title>
      <Typography component="p" variant="h4">
        <strong>{toNumber(accountInfo.core_liquid_balance).toFixed(4)} </strong>
        <small>EOS</small>
      </Typography>
      {/* <div>
        <Link color="primary" href="#">
          View account
        </Link>
      </div> */}
    </React.Fragment>
  );
};

export default Deposits;
