import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import EuToNaLive from '../pages/EuToNaLive';
import Executivos from '../pages/Executivos';
import Ip from '../pages/Ip';
import TurmaIp from '../pages/TurmaIp';
import Comex from '../pages/Comex';
import ComexRank from '../pages/ComexRank';
import Prova from '../pages/Prova';
import Rank from '../pages/Rank';
import RotaDigital from '../pages/RotaDigital';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Prova} />
    <Route path="/eutonalive" component={EuToNaLive} />
    <Route path="/executivos" component={Executivos} />
    <Route path="/ip" component={Ip} />
    <Route path="/ip-128" component={TurmaIp} />
    <Route path="/comex" component={Comex} />
    <Route path="/comex-rank" component={ComexRank} />
    <Route path="/rank" component={Rank} />
    <Route path="/teste-rota-digital" component={RotaDigital} />
  </Switch>
);

export default Routes;
