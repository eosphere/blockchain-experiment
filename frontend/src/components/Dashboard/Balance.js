import React from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import Loading from '../Loading';
import LottCoin from './LottCoin';
import Transfer from './Transfer';
import Title from './Title';
import { TOKEN_SMARTCONTRACT, TOKEN_WALLET_CONTRACT } from 'utils';
import { setBalance } from 'store/account';

class Balance extends React.PureComponent {
  accountName;
  state = {
    loading: true
  };

  async fetchBalance() {
    const { wallet, setBalance } = this.props;
    const { accountName } = this;
    try {
      // Wallet balance
      const { rows: walletBalances = [] } = await wallet.eosApi.rpc.get_table_rows({
        json: true,
        code: TOKEN_SMARTCONTRACT,
        scope: accountName,
        table: 'balances'
      });
      const balance = walletBalances.find(balance => balance.funds.includes('AUD'));
      const walletBalance = balance ? balance.funds : '0 AUD';

      // Bank / Reward balance
      const { rows: rewardAccounts = [] } = await wallet.eosApi.rpc.get_table_rows({
        json: true,
        code: TOKEN_WALLET_CONTRACT,
        scope: accountName,
        table: 'accounts'
      });
      const rewardAccount = rewardAccounts.find(account => account.balance.includes('LOTT'));
      const rewardBalance = rewardAccount ? rewardAccount.balance : '0 LOTT';

      const bankAccount = rewardAccounts.find(account => account.balance.includes('AUD'));
      const bankBalance = bankAccount ? bankAccount.balance : '0 AUD';

      this.setState({ loading: false }, () => {
        setBalance(walletBalance, 'wallet');
        setBalance(rewardBalance, 'reward');
        setBalance(bankBalance, 'bank');
      });
    } catch (error) {
      this.setState(
        {
          loading: false
        },
        () => {
          setBalance('0 LOTT', 'reward');
          setBalance('0 AUD', 'wallet');
          setBalance('0 AUD', 'bank');
        }
      );
    }
  }

  async componentDidMount() {
    const {
      wallet: {
        accountInfo: { account_name: accountName }
      }
    } = this.props;
    this.accountName = accountName;
    this.fetchBalance();
  }

  render() {
    const { loading } = this.state;
    const { wallet, rewardBalance, walletBalance } = this.props;
    if (loading) {
      return <Loading />;
    }
    const { accountName } = this;
    return (
      <>
        <Title>Lottery Account Balances</Title>
        <Typography component="span" variant="h4" gutterBottom>
          <strong>{`Ł ` + rewardBalance || `0 LOTT (Ł)`}</strong>
          <LottCoin />
          {rewardBalance !== '0' && (
            <Transfer type="claim" currency="LOTT" accountName={accountName} wallet={wallet} />
          )}
        </Typography>
        <Typography component="span" variant="h4" gutterBottom>
          <strong>
            {walletBalance && walletBalance.includes('AUD') && '$ '}
            {walletBalance || `$ 0 AUD`}
          </strong>
        </Typography>
        <Typography component="span" variant="h4" gutterBottom>
          <Transfer type="deposit" currency="AUD" accountName={accountName} wallet={wallet} />
          <Transfer type="withdraw" currency="AUD" accountName={accountName} wallet={wallet} />
        </Typography>
        <Typography component="p" variant="body1" gutterBottom>
          <strong>$1.00 AUD = 30 LOTT Tokens</strong>
        </Typography>
        <Typography component="p" variant="body1" gutterBottom>
          <strong>1 Lottery Ticket = 10 LOTT Tokens</strong>
        </Typography>
      </>
    );
  }
}

const mapStateToProps = state => ({
  rewardBalance: state.currentAccount.balances.reward,
  walletBalance: state.currentAccount.balances.wallet
});

const actions = {
  setBalance
};

export default connect(
  mapStateToProps,
  actions
)(Balance);
