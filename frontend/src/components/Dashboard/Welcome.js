import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, Button, Box } from '@material-ui/core';
import { WalletContext } from 'App';
import { Title } from 'components/Dashboard';
import { SET_ACCOUNT } from 'store/actions';

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

const Welcome = () => {
  const classes = useStyles();
  const { wallet } = useContext(WalletContext);
  const {
    accountInfo: { account_name: accountName }
  } = wallet;

  const isAdmin = useSelector(state => state.currentAccount.account.name) === 'numberselect';
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: SET_ACCOUNT, payload: accountName });
  }, [accountName, dispatch]);

  let history = useHistory();
  const buyTicket = () => {
    history.push('/buy/ticket');
  };
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

export default Welcome;
