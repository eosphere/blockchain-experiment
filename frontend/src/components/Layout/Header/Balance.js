import React from 'react';
import { TOKEN_SMARTCONTRACT } from 'utils';
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
        code: TOKEN_SMARTCONTRACT,
        scope: accountName,
        table: 'balances'
      });
      const { rows } = response;
      if (rows.length === 0) return this.setState({ loading: false, funds: '0 AUD' });
      const { funds } = rows[0];
      this.setState({ funds, loading: false });
    } catch (error) {
      this.setState({ loading: false, funds: '0 AUD' });
    }
  }
  render() {
    const { funds, loading } = this.state;
    if (loading) return null;
    return <BalanceChip type="wallet" funds={funds} />;
  }
}

export default Balance;
