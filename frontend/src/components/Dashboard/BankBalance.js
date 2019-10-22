import React from 'react';
import { connect } from 'react-redux';
import { Typography, Box, CircularProgress } from '@material-ui/core';
import Title from './Title';
import { TOKEN_WALLET_CONTRACT } from 'utils';
import { setBalance } from 'store/account';

class BankBalance extends React.PureComponent {
  state = {
    loading: true
  };

  async componentDidMount() {
    const {
      wallet,
      wallet: {
        accountInfo: { account_name: accountName }
      },
      setBalance
    } = this.props;
    try {
      const { rows: balances } = await wallet.eosApi.rpc.get_table_rows({
        json: true,
        code: TOKEN_WALLET_CONTRACT,
        scope: accountName,
        table: 'accounts'
      });
      const { balance } = balances.find(row => row.balance.includes('AUD'));
      this.setState({ loading: false }, () => {
        setBalance(balance, 'bank');
      });
    } catch (error) {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    const { loading } = this.state;
    const { bankBalance } = this.props;
    return (
      <>
        {!loading ? (
          <>
            <Title>External Wallet Balance</Title>
            <Typography component="span" variant="h5">
              <strong>
                {bankBalance && bankBalance.includes('AUD') && '$ '}
                {bankBalance || `$ 0 AUD`}
              </strong>
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

const mapStateToProps = state => ({
  bankBalance: state.currentAccount.balances.bank
});

const actions = {
  setBalance
};

export default connect(
  mapStateToProps,
  actions
)(BankBalance);
