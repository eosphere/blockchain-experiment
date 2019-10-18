import React from 'react';
import { Typography, Box, CircularProgress, makeStyles } from '@material-ui/core';
import Transfer from './Transfer';
import Title from './Title';
import { TOKEN_SMARTCONTRACT, TOKEN_WALLET_CONTRACT } from 'utils';
import Message from '../Message';

const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const LottCoin = () => {
  const classes = useStyles();
  return <img alt="Lott Coin" className={classes.icon} width="45px" src="/lott-logo.png" />;
};

class BankBalance extends React.PureComponent {
  state = {
    loading: true,
    funds: '',
    tokenBalance: '',
    error: false,
    errorMessage: '',
    accountName: ''
  };

  async componentDidMount() {
    const {
      wallet,
      wallet: {
        accountInfo: { account_name: accountName }
      }
    } = this.props;
    this.setState({ accountName });
    try {
      const { rows: balances } = await wallet.eosApi.rpc.get_table_rows({
        json: true,
        code: TOKEN_WALLET_CONTRACT,
        scope: accountName,
        table: 'accounts'
      });
      console.log(balances);
      const { balance } = balances.find(row => row.balance.includes('AUD'));
      this.setState({ funds: balance, loading: false });
    } catch (error) {
      const { message } = error;
      this.setState({
        loading: false,
        error: true,
        errorMessage: `${message}. Please try again.`
      });
    }
  }

  render() {
    const { loading, tokenBalance, funds, error, errorMessage, accountName } = this.state;
    const { wallet } = this.props;
    return (
      <>
        {!loading ? (
          <>
            <Title>Bank Balances</Title>
            <Typography component="span" variant="h4">
              <strong>
                {funds && funds.includes('AUD') && '$ '}
                {funds || `$0`}
              </strong>
            </Typography>
            {error && <Message type="error" message={errorMessage} />}
          </>
        ) : (
          <Box
            flexGrow="1"
            display="flex"
            alignItems="center"
            flexDirection="column"
            justifyContent="center">
            <CircularProgress />
          </Box>
        )}
      </>
    );
  }
}

export default BankBalance;
