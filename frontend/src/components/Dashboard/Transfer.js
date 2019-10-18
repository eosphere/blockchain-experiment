import React from 'react';
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@material-ui/core';
import { TOKEN_SMARTCONTRACT, TOKEN_WALLET_CONTRACT } from 'utils';
import Message from '../Message';
import TransferForm from './TransferForm';

const TransferDialog = ({
  success,
  error,
  errorMessage,
  loading,
  open = false,
  toggleDialog,
  onSubmit,
  redirect,
  transactionId,
  children,
  values,
  title
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {success ? `${title} Success` : `${title} Tokens`}
      </DialogTitle>
      <DialogContent>
        {!success && children}
        {success && (
          <DialogContentText id="alert-dialog-description">
            <Message
              type="success"
              message={`${title} of ${parseFloat(values.quantity).toFixed(2)} ${
                values.currency
              } to ${values.to} was successful.`}
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
            {loading ? <CircularProgress color="inherit" /> : 'Confirm'}
          </Button>
        )}
        {success && (
          <Button
            style={{ minHeight: '52px', minWidth: '75px' }}
            onClick={redirect}
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

class Transfer extends React.PureComponent {
  constructor(props) {
    super(props);
    const { type, accountName } = this.props;
    this.accountName = accountName;

    const from = type === 'deposit' ? accountName : TOKEN_SMARTCONTRACT;
    const to = type === 'deposit' ? TOKEN_SMARTCONTRACT : accountName;

    this.initialState = {
      open: false,
      loading: false,
      error: false,
      errorMessage: '',
      success: false,
      transactionId: '',
      values: {
        from,
        to,
        quantity: '',
        currency: 'AUD',
        memo: ''
      }
    };
    this.state = this.initialState;
  }

  toggleDialog = () => {
    this.setState(prevState => ({
      ...this.initialState,
      open: !prevState.open
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
      () => this.Transfer()
    );
  };

  handleChange = values => {
    this.setState({ values }, () => console.log(this.state));
  };

  async Transfer() {
    const { wallet, accountName } = this.props;
    const {
      values: { from, to, quantity, currency, memo }
    } = this.state;

    try {
      const total = `${parseFloat(quantity).toFixed(2)} ${currency}`;
      const data = { from, to, quantity: total, memo };
      const { transaction_id: transactionId } = await wallet.eosApi.transact(
        {
          actions: [
            {
              account: TOKEN_WALLET_CONTRACT,
              name: 'transfer',
              authorization: [
                {
                  actor: accountName,
                  permission: 'active'
                }
              ],
              data
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

  redirect = () => {
    window.location.reload();
  };

  render() {
    const { open, loading, error, errorMessage, success, transactionId, values } = this.state;
    const { type } = this.props;
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    return (
      <Box display="inline" marginX="5px">
        <Button variant="contained" color="primary" size="small" onClick={this.toggleDialog}>
          {title}
        </Button>
        <TransferDialog
          error={error}
          errorMessage={errorMessage}
          success={success}
          redirect={this.redirect}
          open={open}
          loading={loading}
          toggleDialog={this.toggleDialog}
          onSubmit={this.onSubmit}
          transactionId={transactionId}
          values={values}
          title={title}>
          <TransferForm {...values} values={values} handleChange={this.handleChange} />
        </TransferDialog>
      </Box>
    );
  }
}

export default Transfer;
