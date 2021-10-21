import { React, useEffect, useState } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { notifyError } from '../utils/toasts';

import api from '../services/api';

import '../../src/AutoGoverno.css';

const TurmaIp127 = () => {

  const [isAluno, setIsAluno] = useState(false);
  const [rankBloqueios, setRankBloqueios] = useState([]);

  const getRankBloqueios = async () => {
    try {

      await api.get(`/resultado/bloqueios/`).then((res) => {
        setRankBloqueios(res.data);
      });
    } catch (error) {
      notifyError('O rank de bloqueios, não está disponivel no momento.');
      console.log(error);
      setIsAluno(false);
    }
  }

  useEffect(() => {
    getRankBloqueios();
  }, []);

  return (
    <Container className="p-3" style={{ background: '#000' }}>
      <div className="centerImg">
        <img src={"img/logo-ip.png"} alt="Método IP 127" height="40"/>
      </div>
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="pergunta center">Turma 127</h1>
          <h1 className="pergunta center">Ranking de Bloqueios 🚫</h1>
          <Form style={{ background: '#1a1a1a' }}>
            <fieldset>
              <Form.Group as={Row} className="mb-3">
                <Table striped bordered hover variant="dark">
                  <tbody>
                    {rankBloqueios.map((rank, i) => {
                      return (
                        <>
                          <tr style={{ backgroundColor: i === 0 ?'#e20000': '' }} >
                            <td className="">{`${i + 1}`}º</td>
                            <td 
                              style={{ 
                                fontSize: '13px',
                                whiteSpace: 'nowrap'
                              }} 
                              className="">{`${rank.categoria}`}
                            </td>
                            <td className="center">{`${rank.porcentagem}`}%</td>
                          </tr>
                        </>
                      )
                    })}
                  </tbody>
                </Table>
              </Form.Group>
            </fieldset>
          </Form>
        </Jumbotron>
      ) : (
        <></>
      )}
      <div className="centerImg">
        <img className="logoPablo" src={"img/pablo1.png"} alt="A Ciência da Riqueza"/>
      </div>
    </Container>
  );
};

export default TurmaIp127;
