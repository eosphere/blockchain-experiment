import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import WAL from 'eos-transit';

export function AuthenticatedRoute({ children, component, otherwiseRedirectTo, ...rest }) {
  function renderComponent(props) {
    if (typeof children === 'function') {
      return children(props);
    }

    if (Component) {
      return <Component {...props} />;
    }

    return null;
  }

  return (
    <Route
      {...rest}
      render={props => {
        const isLoggedIn = !!WAL.accessContext.getActiveWallets().length;
        if (isLoggedIn) return renderComponent(props);

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
