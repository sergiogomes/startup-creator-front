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
    <Container className="p-3">
      <div className="centerImg">
        <img src={"img/carona-brasil.png"} alt="Caronas Brasil" height="220"/>
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
            <th>WhatsApp</th>
            <th>Nome</th>
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
                <td>{`${carona.whatsapp}`}</td>
                <td>{`${carona.nome}`}</td>
              </tr>
            </>
          )
        })}
          
        </tbody>
      </Table>
      <h1 className="pergunta center" style={{ fontWeight: 100, margin: '15px', fontSize: '15px' }}>
        Atenção: Essa página tem como objetivo facilitar o acesso aos locais de votação. 
        Não nos responsabilizamos por nada que for combinado entre os participantes.
      </h1>
    </Container>
  );
};

export default Caronas;
