import React from 'react';
import { Redirect, withRouter } from 'react-router';
import WAL from 'eos-transit';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as EOSLogo } from '../assets/eos-logo.svg';
import { ReactComponent as ScatterLogo } from '../assets/scatter-logo.svg';
import { LoginScreenWalletList } from '../components/Wallet';

const useStyles = makeStyles(theme => ({
  paper: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  extendedIcon: {
    margin: '8px 8px 8px 0px'
  }
}));

const Container = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.paper}>{children}</div>;
};

const Icon = ({ type, children }) => {
  const classes = useStyles();
  return (
    <SvgIcon className={classes.extendedIcon}>
      {type === 'eos' ? <EOSLogo /> : <ScatterLogo />}
    </SvgIcon>
  );
};

class Login extends React.PureComponent {
  state = {
    showLoginProviders: false
  };

  isLoggedIn = () => !!WAL.accessContext.getActiveWallets().length;

  toggleLoginProviders = () => {
    this.setState(state => ({ showLoginProviders: !state.showLoginProviders }));
  };

  handleWalletProviderSelect = walletProvider => {
    const wallet = WAL.accessContext.initWallet(walletProvider);

    wallet.connect().then(() => {
      wallet.discover({ pathIndexList: [0, 1, 2, 3, 4, 5, 6] }).then(discoveryData => {
        wallet.login();
      });
    });
  };

  handleWalletReconnectClick = wallet => {
    wallet.connect().then(wallet.login);
  };

  render() {
    const {
      isLoggedIn,
      toggleLoginProviders,
      handleWalletProviderSelect,
      handleWalletReconnectClick,
      state: { showLoginProviders }
    } = this;
    if (isLoggedIn()) return <Redirect to="/" />;
    const { getWallets, getWalletProviders } = WAL.accessContext;
    return (
      <Container>
        {showLoginProviders ? (
          <>
            <LoginScreenWalletList
              walletProviders={getWalletProviders()}
              wallets={getWallets()}
              onWalletProviderSelect={handleWalletProviderSelect}
              onWalletReconnectClick={handleWalletReconnectClick}
              toggleLoginScreen={toggleLoginProviders}
            />
          </>
        ) : (
          <>
            <h1>Welcome to the Blockchain Experiment.</h1>
            <Button variant="contained" size="large" color="primary" onClick={toggleLoginProviders}>
              <Icon type="eos" />
              Login with EOS
            </Button>
          </>
        )}
      </Container>
    );
  }
}

export { Icon };

export default withRouter(Login);
