import { React } from 'react';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Table from 'react-bootstrap/Table';

import '../../src/App.css';

const Rank = () => {
  return (
    <Container className="p-3" style={{ background: '#000' }}>
      <div className="centerImg">
        <img src={"img/CDR600x300.png"} alt="A Ciência da Riqueza" height="75"/>
      </div>
      <Jumbotron className="painel" style={{ background: '#8c6531' }}>
        {/* <div className="centerImg">
          <img src={"img/top-10.png"} alt="A Ciência da Riqueza" height="75"/>
        </div> */}
        <Table className="tableRank" style={{ color: '#fff' }} striped hover>
          <tbody>
            <tr>
              <td>1°</td>
              <td>Janley Soares</td>
              <td>1453</td>
            </tr>
            <tr>
              <td>2°</td>
              <td>Davi Barros</td>
              <td>1445</td>
            </tr>
            <tr>
              <td>3°</td>
              <td>Lucas Pin</td>
              <td>1442</td>
            </tr>
            <tr>
              <td>4°</td>
              <td>Tiago Baron</td>
              <td>1391</td>
            </tr>
            <tr>
              <td>5°</td>
              <td>Leticia Carrer</td>
              <td>1261</td>
            </tr>
            <tr>
              <td>6°</td>
              <td>Janley Soares</td>
              <td>1150</td>
            </tr>
            <tr>
              <td>7°</td>
              <td>Davi Barros</td>
              <td>1022</td>
            </tr>
            <tr>
              <td>8°</td>
              <td>Bruno Dias</td>
              <td>928</td>
            </tr>
            <tr>
              <td>9°</td>
              <td>José Livre</td>
              <td>907</td>
            </tr>
          </tbody>
        </Table>
      </Jumbotron>
      <div className="centerImg">
        <img className="logoPablo" src={"img/pablo1.png"} alt="A Ciência da Riqueza"/>
      </div>
    </Container>
  );
};

export default Rank;