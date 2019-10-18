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

class Balance extends React.PureComponent {
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
        code: TOKEN_SMARTCONTRACT,
        scope: accountName,
        table: 'balances'
      });
      const { rows: accounts } = await wallet.eosApi.rpc.get_table_rows({
        json: true,
        code: TOKEN_WALLET_CONTRACT,
        scope: accountName,
        table: 'accounts'
      });
      const { funds } = balances.find(row => row.funds.includes('AUD'));
      const { balance: tokenBalance } = accounts.find(row => row.balance.includes('LOTT'));
      this.setState({ funds, tokenBalance, loading: false });
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
            <Title>Lottery Account Balances</Title>
            {error && <Message type="error" message={errorMessage} />}
            <Typography component="span" variant="h4">
              <strong>{`Ł ` + tokenBalance || `0 LOTT (Ł)`}</strong>
              <LottCoin />
              <Transfer type="claim" currency="LOTT" accountName={accountName} wallet={wallet} />
            </Typography>
            <Typography component="span" variant="h4">
              <strong>
                {funds && funds.includes('AUD') && '$ '}
                {funds || `$0`}
              </strong>
              {/* <Transfer type="deposit" currency="AUD" accountName={accountName} wallet={wallet} /> */}
              {/* <Transfer type="withdraw" currency="AUD" accountName={accountName} wallet={wallet} /> */}
            </Typography>
            <hr />
            <Typography component="p" variant="body1">
              <strong>$1.00 AUD = 30 LOTT Tokens</strong>
            </Typography>
            <Typography component="p" variant="body1">
              <strong>1 Lottery Ticket = 10 LOTT Tokens</strong>
            </Typography>
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

export default Balance;
