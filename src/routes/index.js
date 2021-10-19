import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import EuToNaLive from '../pages/EuToNaLive';
import AutoGoverno127 from '../pages/AutoGoverno127';
import Prova from '../pages/Prova';
import Rank from '../pages/Rank';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Prova} />
    <Route path="/eutonalive" exact component={EuToNaLive} />
    <Route path="/ip" exact component={AutoGoverno127} />
    <Route path="/rank" exact component={Rank} />
  </Switch>
);

export default Routes;
