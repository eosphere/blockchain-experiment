import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthenticatedRoute } from './components';
import { Login, Dashboard } from './pages';

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/login" exact={true} component={Login} />
      <AuthenticatedRoute>
        {() => (
          <Switch>
            <Route path="/" exact={true} component={Dashboard} />
          </Switch>
        )}
      </AuthenticatedRoute>
      />
    </Switch>
  );
};

export default AppRoutes;
