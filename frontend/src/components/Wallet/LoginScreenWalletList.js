import React from 'react';
import Button from '@material-ui/core/Button';
import AccessContextSubscribe from '../../transit/AccessContextSubscribe';
import { WalletListItem, WalletStateSubscribe } from '../Wallet';

class LoginScreenWalletList extends React.Component {
  handleWalletProviderSelect = walletProvider => {
    const { onWalletProviderSelect } = this.props;
    if (walletProvider && typeof onWalletProviderSelect === 'function') {
      onWalletProviderSelect(walletProvider);
    }
  };

  handleReconnectClick = walletSession => {
    const { onWalletReconnectClick } = this.props;
    if (walletSession && typeof onWalletReconnectClick === 'function') {
      onWalletReconnectClick(walletSession);
    }
  };

  getAvailableWalletProviders = () => {
    const { walletProviders, wallets } = this.props;
    return walletProviders.filter(
      walletProvider => !wallets.some(w => w.provider.id === walletProvider.id)
    );
  };

  render() {
    const { handleWalletProviderSelect, handleReconnectClick, getAvailableWalletProviders } = this;
    const { toggleLoginScreen, wallets } = this.props;
    const availableWalletProviders = getAvailableWalletProviders();

    return (
      <AccessContextSubscribe>
        {() => (
          <>
            <h3>Choose your login option below:</h3>
            {wallets.map(wallet => (
              <WalletStateSubscribe wallet={wallet} key={wallet.provider.id}>
                {() => (
                  <WalletListItem
                    onSelect={handleWalletProviderSelect}
                    onReconnectClick={handleReconnectClick}
                    walletProvider={wallet.provider}
                    wallet={wallet}
                  />
                )}
              </WalletStateSubscribe>
            ))}
            {availableWalletProviders.map(walletProvider => (
              <WalletListItem
                key={walletProvider.id}
                onSelect={handleWalletProviderSelect}
                onReconnectClick={handleReconnectClick}
                walletProvider={walletProvider}
              />
            ))}
            <br />
            <Button variant="outlined" size="small" onClick={toggleLoginScreen}>
              Cancel
            </Button>
          </>
        )}
      </AccessContextSubscribe>
    );
  }
}

export default LoginScreenWalletList;
