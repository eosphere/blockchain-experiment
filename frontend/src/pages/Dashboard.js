import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import Balance from 'components/Dashboard/Balance';
import Transactions from 'components/Dashboard/Transactions';
import Title from 'components/Dashboard/Title';
import Draws from 'components/Dashboard/Draws';
import WAL from 'eos-transit';

import { makeStyles, Grid, Paper, Button, CircularProgress, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    minHeight: 300
  },
  title: {
    textTransform: 'capitalize'
  }
}));

const Welcome = ({ wallet }) => {
  const classes = useStyles();
  const {
    accountInfo: { account_name: accountName }
  } = wallet;
  let history = useHistory();
  const dispatch = useDispatch();

  const buyTicket = () => {
    history.push('/buy/ticket');
  };

  useEffect(() => {
    dispatch({ type: 'SET_ACCOUNT', payload: { name: accountName } });
  }, [accountName, dispatch]);

  const isAdmin = useSelector(state => state.currentAccount.account.name) === 'numberselect';

  return (
    <>
      <Title className={classes.title}>Welcome, {accountName}.</Title>

      {!isAdmin && (
        <Box display="flex" marginY={2}>
          <Button variant="contained" color="primary" size="large" onClick={buyTicket}>
            Buy a Lottery Ticket
          </Button>
        </Box>
      )}
    </>
  );
};

const Wrapper = ({ wallet, children }) => {
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
  return <>{children}</>;
};

const Dashboard = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const wallet = WAL.accessContext.getActiveWallets()[0];
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <Wrapper wallet={wallet}>
            <Welcome wallet={wallet} />
          </Wrapper>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <Wrapper wallet={wallet}>
            <Balance wallet={wallet} />
          </Wrapper>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {wallet && wallet.accountInfo && <Transactions wallet={wallet} />}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Draws wallet={wallet} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
