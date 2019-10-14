import React from 'react';
import { TOKEN_SMARTCONTRACT } from 'utils';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from './Table';
import Title from './Title';

class Transactions extends React.PureComponent {
  state = {
    loading: true,
    rows: {},
    customer: false
  };

  async componentDidMount() {
    const { wallet } = this.props;
    const {
      accountInfo: { account_name: accountName }
    } = wallet;

    let filter;
    let customer = false;
    if (accountName !== 'numberselect') {
      filter = {
        key_type: `i64`,
        upper_bound: accountName,
        lower_bound: accountName,
        index_position: 2
      };
      customer = true;
    }

    const response = await wallet.eosApi.rpc.get_table_rows({
      json: true,
      code: TOKEN_SMARTCONTRACT,
      table: 'tickets',
      scope: TOKEN_SMARTCONTRACT,
      limit: 20,
      reverse: true,
      ...filter
    });
    const { rows } = response;
    this.setState({ rows, loading: false, customer });
  }

  render() {
    const { rows, loading, customer } = this.state;
    return !loading ? (
      <>
        <Title>{customer && `Your `}Recent Purchases</Title>
        <Table rows={rows} />
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
    );
  }
}

export default Transactions;