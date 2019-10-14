import React from 'react';
import { withRouter } from 'react-router-dom';
import { Box, CircularProgress, Button } from '@material-ui/core';
import { TOKEN_SMARTCONTRACT } from 'utils';
import WAL from 'eos-transit';
import AccessContextSubscribe from 'transit/AccessContextSubscribe';
import SelectDraw from './SelectDraw';

class DrawSelector extends React.PureComponent {
  state = { success: false, data: '', loading: true, draw: '', numbers: [1, 2, 3, 4, 5, 30] };

  async componentDidMount() {
    const { wallet } = this.props;
    const response = await wallet.eosApi.rpc.get_table_rows({
      json: true,
      code: TOKEN_SMARTCONTRACT,
      scope: TOKEN_SMARTCONTRACT,
      table: 'draws',
      limit: 100,
      reverse: true
    });
    const { rows } = response;
    const data = rows.filter(row => row.open === 1);
    this.setState({ data, loading: false });
  }

  onClick = value => {
    this.setState({ draw: value, error: false });
  };

  async onTransaction() {
    console.log('onTransaction');
    const {
      wallet,
      wallet: { accountInfo }
    } = this.props;
    const { draw, numbers } = this.state;
    const { account_name: accountName } = accountInfo;
    console.log(wallet);
    try {
      const response = await wallet.eosApi.transact(
        {
          actions: [
            {
              account: TOKEN_SMARTCONTRACT,
              name: 'createticket',
              authorization: [
                {
                  actor: accountName,
                  permission: 'active'
                }
              ],
              data: {
                purchaser: accountName,
                drawnumber: draw,
                entrynumbers: numbers
              }
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      );
      console.log(response);
      this.setState({ success: true });
    } catch (err) {
      // catches errors both in fetch and response.json
      this.setState({ error: true });
    }
  }

  onSubmit = () => {
    const { draw } = this.state;
    if (!draw) {
      this.setState({ error: true });
    } else {
      this.onTransaction();
    }
  };

  render() {
    const { loading, data, error, numbers, success } = this.state;
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
        <SelectDraw draws={data} onClick={this.onClick} />
        <p>{numbers.toString()}</p>
        <Button
          variant="contained"
          size="large"
          color="primary"
          type="submit"
          onClick={this.onSubmit}>
          Submit
        </Button>
        {error && <p>An error has occured. Please try again.</p>}
        {success && <p>Success !</p>}
      </>
    );
  }
}

class NumberSelector extends React.PureComponent {
  state = {};

  handleHome = () => {
    this.props.history.push('/');
  };

  render() {
    const wallet = WAL.accessContext.getActiveWallets()[0];
    return (
      <AccessContextSubscribe>
        {() => (
          <>
            <DrawSelector wallet={wallet} />
            <Button
              variant="contained"
              size="large"
              color="primary"
              type="submit"
              onClick={this.handleHome}>
              Back to Home
            </Button>
          </>
        )}
      </AccessContextSubscribe>
    );
  }
}

export default withRouter(NumberSelector);
