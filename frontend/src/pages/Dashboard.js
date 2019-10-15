import React from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Balance from 'components/Dashboard/Balance';
import Transactions from 'components/Dashboard/Transactions';
import Title from 'components/Dashboard/Title';
import Admin from 'components/Dashboard/Admin';
import Draws from 'components/Dashboard/Draws';
import WAL from 'eos-transit';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 200
  },
  title: {
    textTransform: 'capitalize'
  }
}));

const Welcome = ({ wallet }) => {
  const classes = useStyles();
  const { accountInfo } = wallet;
  let history = useHistory();

  const buyTicket = () => {
    history.push('/buy/ticket');
  };

  return (
    <>
      <Title className={classes.title}>Welcome, {accountInfo.account_name}.</Title>
      <br />
      <Button variant="contained" color="primary" size="large" onClick={buyTicket}>
        Buy a Lottery Ticket
      </Button>
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
      {wallet && <Admin wallet={wallet} paperStyle={classes.paper} />}

      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Draws wallet={wallet} />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {wallet && wallet.accountInfo && <Transactions wallet={wallet} />}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
