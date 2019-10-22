import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { TOKEN_SMARTCONTRACT } from 'utils';
import { Message } from 'components/Shared';
import { Ticket } from '../BuyTicket';
import { useHistory } from 'react-router-dom';
import { refreshDashoard } from 'store/account';

const SetNumbersDialog = ({
  success,
  error,
  errorMessage,
  loading,
  open = false,
  toggleDialog,
  onSubmit,
  drawnumber,
  transactionId,
  numbers,
  children
}) => {
  let history = useHistory();
  const dispatch = useDispatch();
  const refresh = () => {
    dispatch(refreshDashoard('setNumbers'));
    toggleDialog();
    history.push('/loading');
    history.goBack();
  };
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {success ? 'Winning numbers Confirmed' : `Enter Winning Numbers for Draw no. ${drawnumber}`}
      </DialogTitle>
      <DialogContent>
        {!success && children}
        {success && (
          <DialogContentText id="alert-dialog-description">
            <Message
              type="success"
              message={`Winning numbers (${numbers.toString()}) for Draw No. ${drawnumber} set. `}
              transactionId={transactionId}
            />
          </DialogContentText>
        )}
        {error && <Message type="error" message={errorMessage} />}
      </DialogContent>
      <DialogActions>
        {!success && (
          <Button onClick={toggleDialog} color="primary">
            Cancel
          </Button>
        )}
        {!success && (
          <Button
            style={{ minHeight: '52px', minWidth: '75px' }}
            onClick={onSubmit}
            color="primary"
            variant="contained"
            disabled={numbers.length !== 6}
            autoFocus>
            {loading ? <CircularProgress color="inherit" /> : 'Submit'}
          </Button>
        )}
        {success && (
          <Button
            style={{ minHeight: '52px', minWidth: '75px' }}
            onClick={refresh}
            color="primary"
            variant="contained"
            autoFocus>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

class SetNumbers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.initialState = {
      numbers: [],
      open: false,
      loading: false,
      error: false,
      errorMessage: '',
      success: false,
      transactionId: ''
    };
  }

  state = {
    ...this.initialState
  };

  toggleDialog = () => {
    this.setState(prevState => ({
      numbers: [],
      open: !prevState.open,
      loading: false,
      error: false,
      errorMessage: '',
      success: false,
      transactionId: ''
    }));
  };

  onSubmit = () => {
    this.setState(
      prevState => ({
        transactionId: '',
        error: false,
        errorMessage: '',
        loading: !prevState.loading
      }),
      () => this.setNumbers()
    );
  };

  updateNumbers = numbers => {
    this.setState({ numbers, error: false, errorMessage: '' });
  };

  async setNumbers() {
    const { wallet, drawnumber } = this.props;
    const { numbers: winningnumbers } = this.state;
    const {
      accountInfo: { account_name: accountName }
    } = wallet;
    try {
      const { transaction_id: transactionId } = await wallet.eosApi.transact(
        {
          actions: [
            {
              account: TOKEN_SMARTCONTRACT,
              name: 'setwinnums',
              authorization: [
                {
                  actor: accountName,
                  permission: 'active'
                }
              ],
              data: { drawnumber, winningnumbers }
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 60
        }
      );
      this.setState({ loading: false, success: true, transactionId });
    } catch (error) {
      const { message } = error;
      this.setState({
        transactionId: '',
        loading: false,
        error: true,
        errorMessage: `${message}. Please try again.`
      });
    }
  }

  render() {
    const { open, loading, error, errorMessage, success, transactionId, numbers = [] } = this.state;
    const { drawnumber } = this.props;
    return (
      <>
        <Button variant="contained" color="primary" size="small" onClick={this.toggleDialog}>
          Set numbers
        </Button>
        <SetNumbersDialog
          error={error}
          errorMessage={errorMessage}
          success={success}
          open={open}
          loading={loading}
          toggleDialog={this.toggleDialog}
          onSubmit={this.onSubmit}
          drawnumber={drawnumber}
          transactionId={transactionId}
          numbers={numbers}>
          <Ticket showRandom={false} numbers={numbers} updateNumbers={this.updateNumbers} />
        </SetNumbersDialog>
      </>
    );
  }
}

const SetNumbersContainer = ({ wallet, drawnumber }) => {
  const isAdmin = useSelector(state => state.currentAccount.account.name) === 'numberselect';
  if (!isAdmin) return null;
  return <SetNumbers wallet={wallet} drawnumber={drawnumber} />;
};

export default SetNumbersContainer;
