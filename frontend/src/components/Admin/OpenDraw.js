import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  CircularProgress
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Message } from 'components/Shared';
import { TOKEN_SMARTCONTRACT } from 'utils';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { REFRESH } from 'store/actions';

const OpenDrawDialog = ({
  success,
  error,
  errorMessage,
  loading,
  open = false,
  toggleDialog,
  onSubmit,
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
      <DialogTitle id="alert-dialog-title">{success ? 'Success' : 'Confirmation'}</DialogTitle>
      <DialogContent>
        {!success && (
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to open a new draw?
          </DialogContentText>
        )}
        {success && (
          <DialogContentText id="alert-dialog-description">
            <Message
              type="success"
              message={`New draw successfully created. `}
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

class OpenDraw extends React.PureComponent {
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
      () => this.openDraw()
    );
  };

  async openDraw() {
    const { wallet } = this.props;
    const {
      accountInfo: { account_name: accountName }
    } = wallet;
    try {
      const { transaction_id: transactionId } = await wallet.eosApi.transact(
        {
          actions: [
            {
              account: TOKEN_SMARTCONTRACT,
              name: 'createdraw',
              authorization: [
                {
                  actor: accountName,
                  permission: 'active'
                }
              ],
              data: {}
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
    return (
      <Box>
        <Button variant="contained" color="primary" onClick={this.toggleDialog}>
          Create New Draw
        </Button>
        <OpenDrawDialog
          error={error}
          errorMessage={errorMessage}
          success={success}
          open={open}
          loading={loading}
          toggleDialog={this.toggleDialog}
          onSubmit={this.onSubmit}
          transactionId={transactionId}
        />
      </Box>
    );
  }
}

const OpenDrawContainer = ({ wallet }) => {
  const isAdmin = useSelector(state => state.currentAccount.account.name) === 'numberselect';
  if (!isAdmin) return null;
  return (
    <Box display="flex" justifyContent="flex-end" marginBottom={1}>
      <OpenDraw wallet={wallet} />
    </Box>
  );
};

export default OpenDrawContainer;
