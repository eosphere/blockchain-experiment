import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import Title from './Title';

const Admin = ({ wallet, paperStyle }) => {
  const { accountInfo } = wallet;
  if (!accountInfo) return null;
  const { account_name: accountName } = accountInfo;
  if (accountName !== 'numberselect') return null;
  return (
    <Grid item xs={12}>
      <Paper className={paperStyle}>
        <Title>Admin</Title>
        <ul>
          <li>Open a draw </li>
          <li>Close a Draw</li>
          <li>Set Dividends</li>
          <li>Set Winning Numbers</li>
          <li>Process Single Ticket</li>
          <li>Cancel a ticket </li>
          <li>Transfer token to other</li>
          <li>Process All Tickets / Pay (Extra call to another API?)</li>
        </ul>
      </Paper>
    </Grid>
  );
};

export default Admin;
