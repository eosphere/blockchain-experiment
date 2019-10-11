import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Title from './Title';
import { TOKEN_SMARTCONTRACT } from '../../utils';

class Balance extends React.PureComponent {
  state = {
    loading: true,
    data: {}
  };

  async componentDidMount() {
    const { wallet } = this.props;
    const name = wallet.accountInfo.account_name;
    const response = await wallet.eosApi.rpc.get_table_rows({
      json: true,
      code: TOKEN_SMARTCONTRACT,
      scope: name,
      table: 'balances'
    });
    const { rows } = response;
    const data = rows[0] || rows;
    this.setState({ data, loading: false });
  }

  render() {
    const { data, loading } = this.state;
    const { funds, token_contract: tokenContract } = data;
    return (
      <>
        {!loading ? (
          <>
            <Title>Total Balance</Title>
            <Typography component="p" variant="h4">
              <strong>
                {funds.includes('AUD') && '$'}
                {funds}
              </strong>
            </Typography>
            <Typography component="p" variant="body1">
              Smart Contract: {tokenContract}
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
