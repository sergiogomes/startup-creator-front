import { React } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ToastContainer, Zoom } from 'react-toastify';

import Routes from './routes';
import history from './history';

const App = () => (
  <>
    <Router history={history}>
      <ToastContainer limit={1} transition={Zoom} />
      <Routes />
    </Router>
  </>
);

export default App;
