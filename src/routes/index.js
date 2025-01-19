import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import PaginaExemplo from '../pages/PaginaExemplo';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={PaginaExemplo} />
  </Switch>
);

export default Routes;
