import React from 'react';
import { connect } from 'react-redux';
import { Typography, Box, CircularProgress } from '@material-ui/core';
import Title from './Title';
import { TOKEN_WALLET_CONTRACT } from 'utils';
import { SET_BANK_BALANCE } from 'store/actions';

class BankBalance extends React.PureComponent {
  state = {
    loading: true,
    funds: ''
  };

  async componentDidMount() {
    const {
      wallet,
      wallet: {
        accountInfo: { account_name: accountName }
      },
      dispatch
    } = this.props;
    try {
      const { rows: balances } = await wallet.eosApi.rpc.get_table_rows({
        json: true,
        code: TOKEN_WALLET_CONTRACT,
        scope: accountName,
        table: 'accounts'
      });
      const { balance } = balances.find(row => row.balance.includes('AUD'));
      this.setState({ funds: balance, loading: false }, () => {
        dispatch({ type: SET_BANK_BALANCE, payload: balance });
      });
    } catch (error) {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    const { loading, funds } = this.state;
    return (
      <>
        {!loading ? (
          <>
            <Title>External Wallet Balance</Title>
            <Typography component="span" variant="h4">
              <strong>
                {funds && funds.includes('AUD') && '$ '}
                {funds || `$ 0 AUD`}
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

export default connect()(BankBalance);
