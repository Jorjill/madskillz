import * as ROUTES from '../constants/routes';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Home } from '../Screens/Home/Home';
import { Skill } from '../Screens/Skill/Skill';

export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <>
      <Switch>
        <Route
          component={Home}
          exact
          path={ROUTES.HOME}
        />
        <Route
          component={Skill}
          exact
          path={ROUTES.SKILL}
        />
      </Switch>
    </>
  </Router>
);

export default AppRouter;
