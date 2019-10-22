import React from 'react';
import { TOKEN_SMARTCONTRACT } from 'utils';
import Table from './TransactionsTable';
import Title from './Title';
import { SelectDraw } from 'components/BuyTicket';
import { Box, CircularProgress } from '@material-ui/core';

const LoadingSpinner = () => (
  <Box
    flexGrow="1"
    display="flex"
    alignItems="center"
    flexDirection="column"
    justifyContent="center">
    <CircularProgress />
  </Box>
);

class Transactions extends React.PureComponent {
  state = {
    loading: true,
    transactionsLoading: true,
    rows: [],
    draws: [],
    currentDraw: '',
    customer: false
  };
  mounted = false;

  componentWillUnmount() {
    this.mounted = false;
  }

  async fetchDraws() {
    const { wallet } = this.props;
    const drawResponse = await wallet.eosApi.rpc.get_table_rows({
      json: true,
      code: TOKEN_SMARTCONTRACT,
      scope: TOKEN_SMARTCONTRACT,
      table: 'draws',
      limit: 200,
      reverse: true
    });
    const { rows: drawRows } = drawResponse;
    const draws = drawRows.filter(draw => draw.open === 1);
    const { drawnumber: drawNumber } = draws[0] || '';
    this.setState({ draws, currentDraw: drawNumber }, () => {
      this.fetchTransactions();
    });
  }

  async fetchTransactions() {
    const { currentDraw } = this.state;
    const { wallet } = this.props;
    const {
      accountInfo: { account_name: accountName }
    } = wallet;

    let filter;
    if (accountName !== 'numberselect') {
      filter = {
        key_type: `i64`,
        upper_bound: accountName,
        lower_bound: accountName,
        index_position: 2
      };
    }

    const response = await wallet.eosApi.rpc.get_table_rows({
      json: true,
      code: TOKEN_SMARTCONTRACT,
      scope: currentDraw,
      table: 'tickets',
      limit: 20,
      reverse: true,
      ...filter
    });
    const { rows } = response;
    this.mounted && this.setState({ rows, loading: false, transactionsLoading: false });
  }

  async componentDidMount() {
    this.mounted = true;
    this.fetchDraws();
  }

  onClick = value => {
    this.setState({ currentDraw: value, transactionsLoading: true }, () => {
      setTimeout(() => {
        this.fetchTransactions();
      }, 300);
    });
  };

  render() {
    const { draws, rows, loading, transactionsLoading, customer, currentDraw } = this.state;
    const { wallet } = this.props;
    if (loading) {
      return (
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
    return (
      <>
        <Title>{customer && `Your `}Recent Purchases</Title>
        <SelectDraw draws={draws} drawNumber={currentDraw} onClick={this.onClick} />
        {transactionsLoading ? <LoadingSpinner /> : <Table rows={rows} wallet={wallet} />}
      </>
    );
  }
}

export default Transactions;
