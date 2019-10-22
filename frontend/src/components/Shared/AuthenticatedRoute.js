import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import WAL from 'eos-transit';
import { WalletContext } from 'App';

export function AuthenticatedRoute({ children, component, otherwiseRedirectTo, ...rest }) {
  function renderComponent(props) {
    const wallet = WAL.accessContext.getActiveWallets()[0];
    if (typeof children === 'function') {
      return <WalletContext.Provider value={{ wallet }}>{children(props)}</WalletContext.Provider>;
    }

    if (Component) {
      return (
        <WalletContext.Provider value={{ wallet }}>
          <Component {...props} />
        </WalletContext.Provider>
      );
    }

    return null;
  }

  return (
    <Route
      {...rest}
      render={props => {
        const isLoggedIn = !!WAL.accessContext.getActiveWallets().length;
        if (isLoggedIn) {
          return renderComponent(props);
        }
        return (
          <Redirect
            to={{
              pathname: otherwiseRedirectTo || '/login',
              state: { from: props.location }
            }}
          />
        );
      }}
    />
  );
}

export default withRouter(AuthenticatedRoute);
