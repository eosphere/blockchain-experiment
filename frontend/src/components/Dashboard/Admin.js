import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import Title from './Title';

const Admin = ({ wallet, fixedHeightPaper }) => {
  const { accountInfo } = wallet;
  if (!accountInfo) return null;
  const { account_name: accountName } = accountInfo;
  if (accountName !== 'numberselect') return null;
  return (
    <Grid item xs={12}>
      <Paper className={fixedHeightPaper}>
        <Title>Admin</Title>
        {/* <Typography component="p" variant="h4">
          <strong>
            {funds && funds.includes('AUD') && '$'}
            {funds || `$0`}
          </strong>
        </Typography>
        <Typography component="p" variant="body1">
          Smart Contract: {tokenContract}
        </Typography> */}
      </Paper>
    </Grid>
  );
};

export default Admin;
