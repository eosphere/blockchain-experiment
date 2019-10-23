import React from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { setBalance } from 'store/account';
import { TOKEN_WALLET_CONTRACT } from 'utils';
import Title from './Title';
import Loading from 'components/Loading';

class BankBalance extends React.PureComponent {
  state = {
    loading: true
  };

  async fetchBalance() {
    const { wallet, setBalance } = this.props;
    const {
      accountInfo: { account_name: accountName }
    } = wallet;
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

  async componentDidMount() {
    this.fetchBalance();
  }

  render() {
    const { loading } = this.state;
    const { bankBalance } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <>
        <Title>External Wallet Balance</Title>
        <Typography component="span" variant="h5">
          <strong>
            {bankBalance && bankBalance.includes('AUD') && '$ '}
            {bankBalance || `$ 0 AUD`}
          </strong>
        </Typography>
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
