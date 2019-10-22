import React from 'react';
import { TOKEN_WALLET_CONTRACT } from 'utils';
import BalanceChip from './BalanceChip';

class Balance extends React.PureComponent {
  state = {
    loading: true,
    funds: ''
  };
  async componentDidMount() {
    try {
      const {
        wallet,
        wallet: {
          accountInfo: { account_name: accountName }
        }
      } = this.props;
      const response = await wallet.eosApi.rpc.get_table_rows({
        json: true,
        code: TOKEN_WALLET_CONTRACT,
        scope: accountName,
        table: 'accounts'
      });
      if (response.rows.length === 0) return this.setState({ funds: '0 AUD', loading: false });
      const { rows: balances } = response;
      const { balance: funds } = balances.find(row => row.balance.includes('AUD'));
      this.setState({ funds, loading: false });
    } catch (error) {
      this.setState({ funds: '0 AUD', loading: false });
    }
  }
  render() {
    const { funds, loading } = this.state;
    if (loading) return null;
    return <BalanceChip type="bank" funds={funds} />;
  }
}

export default Balance;
