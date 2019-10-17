import React from 'react';
import Title from './Title';
import DrawsTable from './DrawsTable';
import { TOKEN_SMARTCONTRACT } from 'utils';
import { OpenDraw } from '../Admin';

class Draws extends React.PureComponent {
  state = {
    loading: true,
    data: {}
  };

  mounted = false;

  componentWillUnmount() {
    this.mounted = false;
  }

  async componentDidMount() {
    this.mounted = true;
    const { wallet } = this.props;
    const response = await wallet.eosApi.rpc.get_table_rows({
      json: true,
      code: TOKEN_SMARTCONTRACT,
      scope: TOKEN_SMARTCONTRACT,
      table: 'draws',
      limit: 1000,
      reverse: true
    });
    const { rows } = response;
    const data = rows;
    this.mounted && this.setState({ data, loading: false });
  }

  render() {
    const { data, loading } = this.state;
    const { wallet } = this.props;
    if (loading) return null;
    return (
      <>
        <Title>Recent Draws</Title>
        <OpenDraw wallet={wallet} />
        <DrawsTable rows={data} wallet={wallet} />
      </>
    );
  }
}

export default Draws;
