import { React, useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';

import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils/toasts';

import api from '../services/api';

import EstadosCidades from './cidades.json';

import '../../src/RotaDigital.css';

const Caronas = () => {

  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [prova, setProva] = useState('');
  const [aluno, setAluno] = useState({});
  const [isProvaRespondida, setIsProvaRespondida] = useState(false);
  const [pontos, setPontos] = useState(0);
  const [perguntaAtual, setPerguntaAtual] = useState(209);
  const [vis, setVis] = useState(true);

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova/15`);
      const { perguntas, respostas, prova } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
      setProva(prova);
      exibirPergunta(209);
    } catch (error) {
      console.log(error);
      notifyError('Neste momento não tem prova disponivel! Fique atendo nas lives de terça!');
    }
  };

  const exibirPergunta = (id) => {
    console.log('exibir pergunta', id);
    document.getElementById(`pergunta-${id}`).style.display = 'block';
  }

  const esconderPergunta = (id) => {
    console.log('esconder pergunta', id);
    document.getElementById(`pergunta-${id}`).style.display = 'none';
  }

  const enviarResposta = async (event) => {
    try {
      if((perguntaAtual) <= 214) {
        notifyError('Por favor responda todas as perguntas.');
        return false;
      }

      setIsProvaRespondida(true);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } catch (error) {
      console.log(error);
    }
  };

  const setLotado = () => {
    notifyError('Carro lotado, seu nome foi retirado da lista.');
  }

  const setTemVaga = () => {
    notifySuccess('Carro tem vaga, seu nome está na lista.');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  useEffect(() => {
    // getProva();
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
            <th>Custo&nbsp;R$</th>
            <th>Nome</th>
            <th>WhatsApp</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          <tr className="linhas">
            <td>SP</td>
            <td>Santo&nbsp;André</td>
            <td>R$210,00</td>
            <td>Paulo&nbsp;Matos</td>
            <td>(11)98087-5544</td>
            <td>Vou dar apenas carona de ida</td>
          </tr>
          <tr>
            <td>SP</td>
            <td>Barueri</td>
            <td>R$145,00</td>
            <td>Paulo&nbsp;Matos</td>
            <td>(11)98087-5544</td>
            <td>Vou sair as 4 da manhã</td>
          </tr>
          <tr>
            <td>SP</td>
            <td>Barueri</td>
            <td>R$145,00</td>
            <td>Paulo&nbsp;Matos</td>
            <td>(11)98087-5544</td>
            <td>Não vou fazer paradas</td>
          </tr>
        </tbody>
      </Table>
      <>
        <Fab icon="🚗" >
          <Action text="" style={{ background:'#000', textDecoration: 'underline' }} onClick={() => setLotado()}>
            LOTADO
          </Action>
          <Action text="" style={{ background:'#000', textDecoration: 'underline' }} onClick={() => setTemVaga()}>
            TEM VAGA
          </Action>
        </Fab>
      </>
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
