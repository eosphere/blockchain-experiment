import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Deposits from '../components/Dashboard/Deposits';
import Orders from '../components/Dashboard/Orders';
import Title from '../components/Dashboard/Title';
import WAL from 'eos-transit';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 150
  },
  title: {
    textTransform: 'capitalize'
  }
}));

const Welcome = ({ wallet }) => {
  const classes = useStyles();
  const { accountInfo } = wallet;
  return (
    <>
      <Title className={classes.title}>Welcome, {accountInfo.account_name}.</Title>
    </>
  );
};
const BuyTicket = ({ wallet }) => {
  // const classes = useStyles();
  // const { accountInfo } = wallet;
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => alert('Coming Soon.')}>
        Buy a Ticket
      </Button>
      <br />
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => alert('Coming Soon.')}>
        Transfer Funds
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

const DashboardContainer = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const wallet = WAL.accessContext.getActiveWallets()[0];
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4} lg={4}>
        <Paper className={fixedHeightPaper}>
          <Wrapper wallet={wallet}>
            <Welcome wallet={wallet} />
          </Wrapper>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={4}>
        <Paper className={fixedHeightPaper}>
          <Wrapper wallet={wallet}>
            <Deposits wallet={wallet} />
          </Wrapper>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={4}>
        <Paper className={fixedHeightPaper}>
          <Wrapper wallet={wallet}>
            <BuyTicket wallet={wallet} />
          </Wrapper>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Orders />
        </Paper>
      </Grid>
    </Grid>
  );
};

class Dashboard extends React.Component {
  render() {
    return <DashboardContainer />;
  }
}

export default Dashboard;
