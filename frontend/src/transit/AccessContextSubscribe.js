import React from 'react';
import WAL from 'eos-transit';

export class AccessContextSubscribe extends React.Component {
  unsubscribe;
  unmounted;

  handleAccessContextUpdate = () => {
    if (!this.unmounted) this.forceUpdate();
  };

  componentDidMount() {
    this.unsubscribe = WAL.accessContext.subscribe(this.handleAccessContextUpdate);
  }

  componentWillUnmount() {
    this.unmounted = true;
    const { unsubscribe } = this;
    if (typeof unsubscribe === 'function') unsubscribe();
  }

  render() {
    const { children } = this.props;
    if (typeof children !== 'function') return null;
    return children(WAL.accessContext);
  }
}

export default AccessContextSubscribe;
