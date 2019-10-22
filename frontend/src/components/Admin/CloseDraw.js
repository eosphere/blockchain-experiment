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
import { useSelector } from 'react-redux';
import { TOKEN_SMARTCONTRACT } from 'utils';
import { Message } from 'components/Shared';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { REFRESH } from 'store/actions';

const CloseDrawDialog = ({
  success,
  error,
  errorMessage,
  loading,
  open = false,
  toggleDialog,
  onSubmit,
  drawnumber,
  transactionId
}) => {
  let history = useHistory();
  const dispatch = useDispatch();
  const refresh = () => {
    dispatch({ type: REFRESH, payload: 'transferRefresh' });
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
        {success ? 'Draw Closed Success' : 'Draw Close Confirmaton'}
      </DialogTitle>
      <DialogContent>
        {!success && (
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to close <strong>Draw No. {drawnumber}</strong>?
          </DialogContentText>
        )}
        {success && (
          <DialogContentText id="alert-dialog-description">
            <Message
              type="success"
              message={`Draw No. ${drawnumber} closed successfully. `}
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
            autoFocus>
            {loading ? <CircularProgress color="inherit" /> : 'Yes'}
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

class CloseDraw extends React.PureComponent {
  constructor(props) {
    super(props);
    this.initialState = {
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
      () => this.closeDraw()
    );
  };

  async closeDraw() {
    const { wallet, drawnumber } = this.props;
    const {
      accountInfo: { account_name: accountName }
    } = wallet;
    try {
      const { transaction_id: transactionId } = await wallet.eosApi.transact(
        {
          actions: [
            {
              account: TOKEN_SMARTCONTRACT,
              name: 'closedraw',
              authorization: [
                {
                  actor: accountName,
                  permission: 'active'
                }
              ],
              data: { drawnumber: drawnumber }
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
    const { open, loading, error, errorMessage, success, transactionId } = this.state;
    const { drawnumber } = this.props;
    return (
      <>
        <Button variant="contained" color="primary" size="small" onClick={this.toggleDialog}>
          Close Draw
        </Button>
        <CloseDrawDialog
          error={error}
          errorMessage={errorMessage}
          success={success}
          open={open}
          loading={loading}
          toggleDialog={this.toggleDialog}
          onSubmit={this.onSubmit}
          drawnumber={drawnumber}
          transactionId={transactionId}
        />
      </>
    );
  }
}

const CloseDrawContainer = ({ wallet, drawnumber }) => {
  const isAdmin = useSelector(state => state.currentAccount.account.name) === 'numberselect';
  if (!isAdmin) return null;
  return <CloseDraw wallet={wallet} drawnumber={drawnumber} />;
};

export default CloseDrawContainer;
