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
import { Message } from 'components/Shared';
import TransferForm from './TransferForm';
import { connect } from 'react-redux';
import { setBalance } from 'store/account';

const TransferDialog = ({
  success,
  error,
  errorMessage,
  loading,
  open = false,
  toggleDialog,
  onSubmit,
  transactionId,
  children,
  values,
  title
}) => {
  const refresh = () => {
    toggleDialog();
  };
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {success ? `${title} Success` : `${title} Token Currency`}
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

class Transfer extends React.PureComponent {
  constructor(props) {
    super(props);
    const { type, accountName, currency } = this.props;
    this.accountName = accountName;

    const from = type === 'deposit' || type === 'claim' ? accountName : TOKEN_SMARTCONTRACT;
    const to = type === 'deposit' || type === 'claim' ? TOKEN_SMARTCONTRACT : accountName;

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
        currency,
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
    this.setState({ values });
  };

  async fetchBalances() {
    const { wallet, accountName, setBalance } = this.props;
    const { rows: walletBalances = [] } = await wallet.eosApi.rpc.get_table_rows({
      json: true,
      code: TOKEN_SMARTCONTRACT,
      scope: accountName,
      table: 'balances'
    });
    const walletAccount = walletBalances.find(balance => balance.funds.includes('AUD'));
    const walletBalance = walletAccount ? walletAccount.funds : '0 AUD';

    // Bank / Reward balance
    const { rows: rewardAccounts = [] } = await wallet.eosApi.rpc.get_table_rows({
      json: true,
      code: TOKEN_WALLET_CONTRACT,
      scope: accountName,
      table: 'accounts'
    });
    const rewardAccount = rewardAccounts.find(account => account.balance.includes('LOTT'));
    const rewardBalance = rewardAccount ? rewardAccount.balance : '0 LOTT';

    const bankAccount = rewardAccounts.find(account => account.balance.includes('AUD'));
    const bankBalance = bankAccount ? bankAccount.balance : '0 AUD';

    setBalance(bankBalance, 'bank');
    setBalance(rewardBalance, 'reward');
    setBalance(walletBalance, 'wallet');
  }

  async Transfer() {
    const { wallet, accountName, type } = this.props;
    const {
      values: { from, to, quantity, currency, memo }
    } = this.state;
    try {
      const actionName = type === 'withdraw' ? 'withdraw' : 'transfer';
      const account = type === 'withdraw' ? TOKEN_SMARTCONTRACT : TOKEN_WALLET_CONTRACT;
      const total = `${parseFloat(quantity).toFixed(2)} ${currency}`;
      const data =
        type === 'withdraw'
          ? {
              account: to,
              quantity: total
            }
          : { from, to, quantity: total, memo };
      const { transaction_id: transactionId } = await wallet.eosApi.transact(
        {
          actions: [
            {
              account,
              name: actionName,
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
      this.setState({ loading: false, success: true, transactionId }, () => this.fetchBalances());
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
          open={open}
          loading={loading}
          toggleDialog={this.toggleDialog}
          onSubmit={this.onSubmit}
          transactionId={transactionId}
          values={values}
          title={title}>
          <TransferForm {...values} type={type} values={values} handleChange={this.handleChange} />
        </TransferDialog>
      </Box>
    );
  }
}

const mapStateToProps = () => ({});

const actions = { setBalance };

export default connect(
  mapStateToProps,
  actions
)(Transfer);
