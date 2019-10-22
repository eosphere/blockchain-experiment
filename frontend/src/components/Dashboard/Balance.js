import React from 'react';
import { connect } from 'react-redux';
import { Typography, Box, CircularProgress, makeStyles } from '@material-ui/core';
import Transfer from './Transfer';
import Title from './Title';
import { TOKEN_SMARTCONTRACT, TOKEN_WALLET_CONTRACT } from 'utils';
import { setBalance } from 'store/account';

const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export const LottCoin = ({ width = '45px', noMargin = false }) => {
  const classes = useStyles();
  const className = !noMargin ? classes.icon : '';
  return <img alt="Lott Coin" className={className} width={width} src="/lott-logo.png" />;
};

class Balance extends React.PureComponent {
  state = {
    loading: true,
    funds: '',
    tokenBalance: '',
    accountName: ''
  };

  async componentDidMount() {
    const {
      wallet,
      wallet: {
        accountInfo: { account_name: accountName }
      },
      setBalance
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
      this.setState({ funds, tokenBalance, loading: false }, () => {
        setBalance(tokenBalance, 'reward');
        setBalance(funds, 'wallet');
      });
    } catch (error) {
      this.setState(
        {
          loading: false,
          tokenBalance: '0'
        },
        () => {
          setBalance('0 LOTT', 'reward');
          setBalance('0 AUD', 'wallet');
        }
      );
    }
  }

  render() {
    const { loading, tokenBalance, funds, accountName } = this.state;
    const { wallet } = this.props;
    return (
      <>
        {!loading ? (
          <>
            <Title>Lottery Account Balances</Title>
            <Typography component="span" variant="h4" gutterBottom>
              <strong>{`Ł ` + tokenBalance || `0 LOTT (Ł)`}</strong>
              <LottCoin />
              {tokenBalance !== '0' && (
                <Transfer type="claim" currency="LOTT" accountName={accountName} wallet={wallet} />
              )}
            </Typography>
            <Typography component="span" variant="h4" gutterBottom>
              <strong>
                {funds && funds.includes('AUD') && '$ '}
                {funds || `$ 0 AUD`}
              </strong>
            </Typography>
            <Typography component="p" variant="body1" gutterBottom>
              <strong>$1.00 AUD = 30 LOTT Tokens</strong>
            </Typography>
            <Typography component="p" variant="body1" gutterBottom>
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

const mapStateToProps = () => ({});

const actions = {
  setBalance
};

export default connect(
  mapStateToProps,
  actions
)(Balance);
