import React from 'react';

export class WalletStateSubscribe extends React.Component {
  unsubscribe;
  unmounted;

  handleWalletStateUpdate = () => {
    if (!this.unmounted) this.forceUpdate();
  };

  componentDidMount() {
    const { wallet } = this.props;
    this.unsubscribe = wallet.subscribe(this.handleWalletStateUpdate);
  }

  componentWillUnmount() {
    this.unmounted = true;
    const { unsubscribe } = this;
    if (typeof unsubscribe === 'function') unsubscribe();
  }

  render() {
    const { children, wallet } = this.props;
    if (typeof children !== 'function') return null;
    return children(wallet.state);
  }
}

export default WalletStateSubscribe;
