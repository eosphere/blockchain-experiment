import React, { useContext } from 'react';
import clsx from 'clsx';
import {
  Balance,
  BankBalance,
  Transactions,
  Draws,
  Welcome,
  LoadingWrapper
} from 'components/Dashboard';
import { makeStyles, Grid, Paper } from '@material-ui/core';
import { WalletContext } from 'App';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    minHeight: 300
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const { wallet } = useContext(WalletContext);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Paper className={fixedHeightPaper}>
          <LoadingWrapper wallet={wallet}>
            <Welcome />
          </LoadingWrapper>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper className={fixedHeightPaper}>
          <LoadingWrapper wallet={wallet}>
            <BankBalance wallet={wallet} />
          </LoadingWrapper>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper className={fixedHeightPaper}>
          <LoadingWrapper wallet={wallet}>
            <Balance wallet={wallet} />
          </LoadingWrapper>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <LoadingWrapper wallet={wallet}>
            <Transactions wallet={wallet} />
          </LoadingWrapper>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <LoadingWrapper wallet={wallet}>
            <Draws wallet={wallet} />
          </LoadingWrapper>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
