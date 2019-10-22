import React from 'react';
import { Redirect, withRouter } from 'react-router';
import WAL from 'eos-transit';
import { SvgIcon, makeStyles, Button, CircularProgress, Typography } from '@material-ui/core';
import { ReactComponent as EOSLogo } from 'assets/eos-logo.svg';
import { ReactComponent as ScatterLogo } from 'assets/scatter-logo.svg';
import { LoginScreenWalletList } from 'components/Wallet';

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
    showLoginProviders: false,
    loading: true
  };

  componentDidMount() {
    const thisContext = this;
    // Deal with Localstorage removal delay.
    setTimeout(function() {
      if (localStorage.getItem('loggedIn')) {
        return thisContext.attemptLogin();
      }
      thisContext.setState({ loading: false });
    }, 50);
  }

  attemptLogin = () => {
    const { getWalletProviders } = WAL.accessContext;
    const providers = getWalletProviders();
    const provider = providers[0];
    const wallet = WAL.accessContext.initWallet(provider);
    wallet.connect().then(() => {
      wallet
        .login()
        .then(() => {
          localStorage.setItem('loggedIn', true);
        })
        .catch(error => {
          localStorage.removeItem('loggedIn');
          this.setState({ showLoginProviders: true, loading: false });
        });
    });
  };

  isLoggedIn = () => !!WAL.accessContext.getActiveWallets().length;

  toggleLoginProviders = () => {
    this.setState(state => ({ showLoginProviders: !state.showLoginProviders }));
  };

  handleWalletProviderSelect = walletProvider => {
    const wallet = WAL.accessContext.initWallet(walletProvider);

    wallet.connect().then(() => {
      wallet.login().then(() => {
        localStorage.setItem('loggedIn', true);
      });
    });
  };

  handleWalletReconnectClick = wallet => {
    wallet.connect().then(() => {
      wallet.login().then(() => {
        localStorage.setItem('loggedIn', true);
      });
    });
  };

  render() {
    const {
      isLoggedIn,
      toggleLoginProviders,
      handleWalletProviderSelect,
      handleWalletReconnectClick,
      state: { showLoginProviders, loading }
    } = this;
    if (isLoggedIn()) return <Redirect to="/" />;
    const { getWallets, getWalletProviders } = WAL.accessContext;
    return (
      <Container>
        {showLoginProviders ? (
          <LoginScreenWalletList
            walletProviders={getWalletProviders()}
            wallets={getWallets()}
            onWalletProviderSelect={handleWalletProviderSelect}
            onWalletReconnectClick={handleWalletReconnectClick}
            toggleLoginScreen={toggleLoginProviders}
          />
        ) : (
          <>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Typography align="center" variant="h4" gutterBottom>
                  Welcome to the Blockchain Experiment.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={toggleLoginProviders}>
                  <Icon type="eos" />
                  Login with EOS
                </Button>
              </>
            )}
          </>
        )}
      </Container>
    );
  }
}

export { Icon };

export default withRouter(Login);
