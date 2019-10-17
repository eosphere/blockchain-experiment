import React from 'react';
import { withRouter } from 'react-router-dom';
import { Box, CircularProgress, Button, withStyles } from '@material-ui/core';
import { TOKEN_SMARTCONTRACT } from 'utils';
import WAL from 'eos-transit';
import AccessContextSubscribe from 'transit/AccessContextSubscribe';
import SelectDraw from './SelectDraw';
import Ticket from './Ticket';
import Message from '../Message';

const NO_DRAW_ERROR = 'No draw selected. Please select a draw and your lucky numbers.';
const NO_NUMBERS_ERROR = 'Please select your 6 lucky numbers.';

const ColorCircularProgress = withStyles({
  root: {
    color: '#fff'
  }
})(CircularProgress);

const SubmitButton = withStyles({
  root: {
    color: '#fff',
    backgroundColor: '#ba68c8',
    minHeight: '56px',
    '&:hover': {
      backgroundColor: '#ab47bc'
    }
  }
})(Button);

class DrawSelector extends React.PureComponent {
  state = {
    error: false,
    errorMessage: '',
    success: false,
    pending: false,
    data: '',
    loading: true,
    randomLoading: false,
    draw: '',
    numbers: [],
    transactionId: ''
  };

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
    this.setState({ draw: value, error: false, errorMessage: '', transactionId: '' });
  };

  async onTransaction() {
    const {
      wallet,
      wallet: { accountInfo }
    } = this.props;
    const { draw, numbers } = this.state;
    const { account_name: accountName } = accountInfo;
    try {
      const { transaction_id: transactionId } = await wallet.eosApi.transact(
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
                entrynumbers: numbers,
                genreward: true
              }
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 60
        }
      );
      this.setState({ pending: false, success: true, transactionId });
    } catch (error) {
      const { message } = error;
      this.setState({
        transactionId: '',
        pending: false,
        error: true,
        errorMessage: `${message}. Please try again.`
      });
    }
  }

  setError = errorMessage => {
    this.setState({
      transactionId: '',
      pending: false,
      error: true,
      errorMessage,
      randomLoading: false
    });
  };

  onSubmit = () => {
    const { draw, numbers } = this.state;
    this.setState({
      transactionId: '',
      pending: true,
      success: false,
      error: false,
      errorMessage: ''
    });
    if (!draw) {
      this.setError(NO_DRAW_ERROR);
    } else if (numbers.length !== 6) {
      this.setError(NO_NUMBERS_ERROR);
    } else {
      this.onTransaction();
    }
  };

  updateNumbers = numbers => {
    this.setState({ numbers, error: false, errorMessage: '', randomLoading: false });
  };

  async test() {
    try {
      let response = await fetch(
        `https://www.random.org/integer-sets/?sets=1&num=6&min=1&max=45&seqnos=off&commas=on&sort=on&order=index&format=plain&rnd=new`
      );
      const numberResponse = await response.text();
      const numberArray = JSON.parse('[' + numberResponse + ']');
      this.updateNumbers(numberArray);
    } catch (error) {
      this.setError('An error occured trying to generate random numbers. Please try again');
    }
  }

  generateRandomNumbers = () => {
    this.setState({ randomLoading: true }, () => this.test());
  };

  render() {
    const {
      loading,
      pending,
      data,
      error,
      errorMessage,
      numbers,
      success,
      transactionId,
      randomLoading
    } = this.state;
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
        <Ticket
          hideRandom={false}
          loading={randomLoading}
          numbers={numbers}
          updateNumbers={this.updateNumbers}
          generateRandomNumbers={this.generateRandomNumbers}
        />
        <h2>Cost: $1.00 AUD - 1 game</h2>
        {error && <Message type="error" message={errorMessage} />}
        {success && (
          <Message
            type="success"
            message={`Transaction Successful.`}
            transactionId={transactionId}
          />
        )}
        <SubmitButton
          variant="contained"
          size="large"
          color="primary"
          type="submit"
          onClick={this.onSubmit}>
          {pending ? <ColorCircularProgress /> : `Buy Ticket`}
        </SubmitButton>
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
              color="default"
              size="large"
              type="submit"
              style={{ marginTop: '8px' }}
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
