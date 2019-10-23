import React from 'react';
import { connect } from 'react-redux';
import { TOKEN_SMARTCONTRACT } from 'utils';
import Table from './TransactionsTable';
import Title from './Title';
import { SelectDraw } from 'components/BuyTicket';
import Loading from 'components/Loading';

class Transactions extends React.PureComponent {
  state = {
    loading: true,
    transactionsLoading: true,
    rows: [],
    draws: [],
    currentDraw: ''
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
    const { rows: draws } = drawResponse;
    const { drawnumber: drawNumber } = draws[0] || '';
    this.mounted &&
      this.setState({ draws, currentDraw: drawNumber }, () => {
        this.fetchTransactions();
      });
  }

  async fetchTransactions() {
    const { currentDraw } = this.state;
    const { wallet, accountName } = this.props;
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
    this.mounted &&
      this.setState({ currentDraw: value, transactionsLoading: true }, () => {
        setTimeout(() => {
          this.fetchTransactions();
        }, 250);
      });
  };

  render() {
    const { draws, rows, loading, transactionsLoading, currentDraw } = this.state;
    const { wallet, isTicketBuyer } = this.props;

    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <Title>{isTicketBuyer && `Your `}Recent Purchases</Title>
        <SelectDraw draws={draws} drawNumber={currentDraw} onClick={this.onClick} />
        {transactionsLoading ? <Loading /> : <Table rows={rows} wallet={wallet} />}
      </>
    );
  }
}

const mapStateToProps = state => {
  const accountName = state.currentAccount.account.name;
  return {
    accountName,
    isTicketBuyer: accountName.includes('ticketbuyer')
  };
};

export default connect(mapStateToProps)(Transactions);
