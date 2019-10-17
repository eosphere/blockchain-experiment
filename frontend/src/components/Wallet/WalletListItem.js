import React from 'react';
import { Icon } from '../../pages/Login';
import clsx from 'clsx';
import { MdError as ErrorIcon } from 'react-icons/md';

import { Button, makeStyles, CircularProgress, Snackbar, SnackbarContent } from '@material-ui/core';

const useStyles1 = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}));

function MySnackbarContentWrapper(props) {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <ErrorIcon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      {...other}
    />
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    color: '#fff',
    backgroundColor: '#20b6e8',
    '&:hover': {
      backgroundColor: '#1496c1'
    },
    minHeight: '56px',
    minWidth: '310px'
  },
  progress: {
    color: '#fff'
  }
}));

const WalletButton = ({
  hasError,
  errorMessage,
  inProgress,
  providerName,
  onClick,
  handleReconnectClick
}) => {
  const classes = useStyles();

  return (
    <>
      <Button
        className={classes.root}
        variant="contained"
        size="large"
        color="primary"
        onClick={!hasError ? onClick : handleReconnectClick}>
        {inProgress ? (
          <CircularProgress className={classes.progress} />
        ) : (
          <>
            <Icon />
            Login with {providerName}
          </>
        )}
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={hasError && !inProgress}>
        <MySnackbarContentWrapper
          variant="error"
          className={classes.margin}
          message={`${errorMessage}. Please try again.`}
        />
      </Snackbar>
    </>
  );
};

class WalletListItem extends React.Component {
  isSelectable = () => {
    const { wallet } = this.props;
    return !wallet;
  };

  handleSelect = () => {
    const { isSelectable } = this;
    if (!isSelectable()) return;
    const { onSelect, walletProvider } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(walletProvider);
    }
  };

  handleReconnectClick = () => {
    const { onReconnectClick, wallet } = this.props;
    if (wallet && typeof onReconnectClick === 'function') {
      onReconnectClick(wallet);
    }
  };

  render() {
    const { handleSelect, handleReconnectClick } = this;
    const { walletProvider, wallet } = this.props;
    const hasError = (wallet && wallet.hasError) || false;
    const inProgress = (wallet && wallet.inProgress) || false;
    const providerName = walletProvider.meta && walletProvider.meta.name;
    const errorMessage = hasError && wallet.errorMessage;

    return (
      <>
        <WalletButton
          hasError={hasError}
          errorMessage={errorMessage}
          inProgress={inProgress}
          providerName={providerName}
          onClick={handleSelect}
          handleReconnectClick={handleReconnectClick}
        />
      </>
    );
  }
}

export default WalletListItem;
