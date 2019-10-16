import React from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';
import Title from 'components/Dashboard/Title';
import { NumberSelector } from 'components/BuyTicket';

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

const BuyTicket = () => {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <Title>Play the Blockchain Lotto</Title>
        <NumberSelector />
      </Paper>
    </Grid>
  );
};

export default BuyTicket;
