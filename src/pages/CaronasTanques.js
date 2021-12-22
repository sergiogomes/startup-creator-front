import { React, useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import { unformat, format } from 'currency-formatter';

import 'react-tiny-fab/dist/styles.css';

import { notifyError, notifySuccess } from '../utils/toasts';

import api from '../services/api';

import '../../src/RotaDigital.css';

const Caronas = () => {

  const [caronas, setCaronas] = useState([]);

  const getCaronas = async () => {
    try {
      const { data } = await api.get(`/caronas`);
      setCaronas(data);
      console.log('getCaronas', data);
    } catch (error) {
      console.log(error);
      notifyError('Neste momento não tem pessoas que vão dar carona! Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    getCaronas();
  }, []);

  return (
    <Container className="p-3" style={{ background: '#000' }}>
      <div className="centerImg">
        <img src={"img/logo-caronas.png"} alt="O Chamado 2022" height="220"/>
      </div>
      <h1 className="perguntaGeneral center" style={{ paddingBottom: '20px' }}>
        Se você está procurando carona.
        Veja a lista abaixo e entre em contato com o dono do veículo.
      </h1>
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr className="linhas">
            <th>Estado</th>
            <th>Cidade</th>
            <th>R$ Custo&nbsp;por&nbsp;pessoa</th>
            <th>Nome</th>
            <th>WhatsApp</th>
          </tr>
        </thead>
        <tbody>
        {caronas.map((carona, i) => {
          if (carona.whatsapp === '' || carona.estado === '') {
            return;
          }
          const custoFormatado = format(carona.custo, { code: 'BRA' });
          return (
            <>
              <tr className="linhas">
                <td>{`${carona.estado}`}</td>
                <td>{`${carona.cidade}`}</td>
                <td>{`R$ ${custoFormatado}`}</td>
                <td>{`${carona.nome}`}</td>
                <td>{`${carona.whatsapp}`}</td>
              </tr>
            </>
          )
        })}
          
        </tbody>
      </Table>
      <h1 className="pergunta center" style={{ fontWeight: 100, margin: '15px', fontSize: '15px' }}>
        Atenção: Essa página tem como objetivo facilitar o acesso de todos ao evento. 
        Não nos responsabilizamos por nada que for combinado entre os participantes.
      </h1>
      <div className="centerImg">
        <img className="logoRotaDigital" src={"img/pablo1.png"} alt="Pablo Marçal"/>
      </div>
    </Container>
  );
};

export default Caronas;
