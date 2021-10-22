import { React, useEffect, useState } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { notifyError } from '../utils/toasts';

import api from '../services/api';

import '../../src/AutoGoverno.css';

const Executivos = () => {

  const [isAluno, setIsAluno] = useState(false);
  const [rankBloqueios, setRankBloqueios] = useState([]);

  const getRankBloqueios = async () => {
    try {

      await api.get(`/comex`).then((res) => {
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
        <img src={"img/metodo-ip-comex.png"} alt="Comex" height="40"/>
      </div>
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="pergunta center">COMEX</h1>
          <h1 className="pergunta center">Executivos que responderam a enquete de bloqueios 🚫</h1>
          <Form style={{ background: '#1a1a1a' }}>
            <fieldset>
              <Form.Group as={Row} className="mb-3">
                <Table striped bordered hover variant="dark">
                  <tbody>
                    {rankBloqueios.map((executivos, i) => {
                      return (
                        <>
                          <tr>
                            <td className="center">{`${executivos.email}`}</td>
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

export default Executivos;
