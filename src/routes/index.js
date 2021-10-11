import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import EuToNaLive from '../pages/EuToNaLive';
import Prova from '../pages/Prova';
import Rank from '../pages/Rank';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Prova} />
    <Route path="/eutonalive" exact component={EuToNaLive} />
    <Route path="/rank" exact component={Rank} />
  </Switch>
);

export default Routes;
