import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  makeStyles,
  Tooltip
} from '@material-ui/core';
import { MdRemoveCircle } from 'react-icons/md';
import { TOKEN_SMARTCONTRACT } from 'utils';
import Message from '../Message';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: '0',
    padding: '10px',
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  icon: {
    color: '#fff'
  }
}));

const CancelTicketDialog = ({
  success,
  error,
  errorMessage,
  loading,
  open = false,
  toggleDialog,
  onSubmit,
  redirect,
  drawnumber,
  serialno,
  transactionId
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {success ? 'Cancel Success' : 'Cancel Confirmation'}
      </DialogTitle>
      <DialogContent>
        {!success && (
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel Ticket <strong>Serial No. {serialno}</strong> on{' '}
            <strong>Draw No. {drawnumber}</strong>?
          </DialogContentText>
        )}
        {success && (
          <DialogContentText id="alert-dialog-description">
            <>
              <Message
                type="success"
                message={`Ticket Serial No. ${serialno} on Draw No. ${drawnumber} cancelled successfully. `}
                transactionId={transactionId}
              />
            </>
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

const CancelButton = ({ onClick }) => {
  const classes = useStyles();
  return (
    <Tooltip title="Cancel Ticket" aria-label="cancel-ticket">
      <Button className={classes.root} size="small" color="default" onClick={onClick}>
        <MdRemoveCircle className={classes.icon} />
      </Button>
    </Tooltip>
  );
};

class CancelTicket extends React.PureComponent {
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
      () => this.cancelTicket()
    );
  };

  async cancelTicket() {
    const { wallet, ticket } = this.props;
    const {
      accountInfo: { account_name: accountName }
    } = wallet;
    const { purchaser, serialno, drawnumber } = ticket;

    try {
      const { transaction_id: transactionId } = await wallet.eosApi.transact(
        {
          actions: [
            {
              account: TOKEN_SMARTCONTRACT,
              name: 'cancelticket',
              authorization: [
                {
                  actor: accountName,
                  permission: 'active'
                }
              ],
              data: {
                purchaser,
                serial_no: serialno,
                drawnumber
              }
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
      this.setState({ transactionId: '', loading: false, error: true, errorMessage: message });
    }
  }

  redirect = () => {
    window.location.reload();
  };

  render() {
    const { open, loading, error, errorMessage, success, transactionId } = this.state;
    const { ticket } = this.props;
    const { drawnumber, serialno, ticket_status: status } = ticket;
    const isPurchased = status === 0;
    return (
      <>
        {isPurchased ? (
          <>
            <CancelButton onClick={this.toggleDialog} />
            <CancelTicketDialog
              error={error}
              errorMessage={errorMessage}
              success={success}
              redirect={this.redirect}
              open={open}
              loading={loading}
              toggleDialog={this.toggleDialog}
              onSubmit={this.onSubmit}
              drawnumber={drawnumber}
              serialno={serialno}
              transactionId={transactionId}
            />
          </>
        ) : null}
      </>
    );
  }
}

export default CancelTicket;
