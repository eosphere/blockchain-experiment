import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthenticatedRoute } from './components';
import { Login, Dashboard, Profile, Transfer, BuyTicket } from './pages';

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/login" exact={true} component={Login} />
      <AuthenticatedRoute>
        {() => (
          <Switch>
            <Route path="/" exact={true} component={Dashboard} />
            <Route path="/profile" exact={true} component={Profile} />
            <Route path="/transfer" exact={true} component={Transfer} />
            <Route path="/buy/ticket" exact={true} component={BuyTicket} />
          </Switch>
        )}
      </AuthenticatedRoute>
      />
    </Switch>
  );
};

export default AppRoutes;
