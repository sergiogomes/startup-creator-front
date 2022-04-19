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
// import Rank from '../pages/Rank';
import RotaDigital from '../pages/RotaDigital';
import RotaDigitalProva from '../pages/RotaDigitalProva';
import Tribos from '../pages/Tribos';
import ChristianBarbosa from '../pages/ChristianBarbosa';
import PiorSemana from '../pages/PiorSemana';
import ComoEnriquecer from '../pages/ComoEnriquecer';
import Caronas from '../pages/Caronas';
import CaronasTanques from '../pages/CaronasTanques';
import VeloyCard from '../pages/VeloyCard';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Caronas} />
    <Route path="/veloycard" exact component={VeloyCard} />
    <Route path="/eutonalive" component={EuToNaLive} />
    <Route path="/executivos" component={Executivos} />
    <Route path="/ip" component={Ip} />
    <Route path="/ip-128" component={TurmaIp} />
    <Route path="/comex" component={Comex} />
    <Route path="/comex-rank" component={ComexRank} />
    {/* <Route path="/rank" component={Rank} /> */}
    <Route path="/teste-rota-digital" component={RotaDigital} />
    <Route path="/teste-12-tribos" component={Tribos} />
    <Route path="/teste-rota-digital-prova" component={RotaDigitalProva} />
    <Route path="/quiz-como-enriquecer" component={ComoEnriquecer} />
    
    <Route path="/teste-christian-barbosa" component={ChristianBarbosa} />
    <Route path="/pior-semana-da-sua-vida-quizz" component={PiorSemana} />
    <Route path="/caronas" component={Caronas} />
    <Route path="/caronas-tanques" component={CaronasTanques} />
  </Switch>
);

export default Routes;
