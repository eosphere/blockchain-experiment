import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
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
    height: 240
  }
}));

const Welcome = () => {
  return (
    <>
      <Title>Buy a Ticket</Title>
      <div>
        <Link color="primary" href="#">
          Buy a Ticket
        </Link>
      </div>
    </>
  );
};

const DashboardContainer = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const wallet = WAL.accessContext.getActiveWallets()[0];
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4} lg={4}>
        <Paper className={fixedHeightPaper}>
          <Welcome wallet={wallet} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={4}>
        <Paper className={fixedHeightPaper}>
          <Deposits wallet={wallet} />
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
  logout = () => {
    const wallet = WAL.accessContext.getActiveWallets()[0];
    wallet.terminate();
  };
  render() {
    return <DashboardContainer />;
  }
}

export default Dashboard;
