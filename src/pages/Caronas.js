import { React, useEffect, useState } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import { Helmet } from "react-helmet";

import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toasts';

import api from '../services/api';

import EstadosCidades from './cidades.json';

import '../../src/RotaDigital.css';

const Caronas = () => {

  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [prova, setProva] = useState('');
  const [isAluno, setIsAluno] = useState(true);
  const [aluno, setAluno] = useState({});
  const [isProvaRespondida, setIsProvaRespondida] = useState(false);
  const [pontos, setPontos] = useState(0);
  const [perfilSelecionado, setPerfilSelecionado] = useState('Carregando...');
  const [perguntaAtual, setPerguntaAtual] = useState(209);
  const [estado, setEstado] = useState('');
  const [cidades, setCidades] = useState([]);

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

  const salvarResposta = async (event) => {
    try {
      const opcao = event.target.getAttribute('opcao');

      if (opcao === 'A') {
        setPontos(pontos + 7);
      }

      if (opcao === 'B') {
        setPontos(pontos + 11);
      }

      if (opcao === 'C') {
        setPontos(pontos + 16);
      }

      exibirProximaPergunta();
    } catch (error) {
      console.log(error);
    } finally {
      setPerfilSelecionado(getPerfil());
    }
  };

  const exibirProximaPergunta = () => {
    if (perguntaAtual === 215) {
      enviarResposta();
      return;
    }

    if (perguntaAtual === 0) {
      exibirPergunta(209);
      setPerguntaAtual(209);
      return;
    }

    if (perguntaAtual >= 209) {
      exibirPergunta(perguntaAtual + 1);
      setPerguntaAtual(perguntaAtual + 1);
      esconderPergunta(perguntaAtual);
      return;
    }
  }

  const exibirPergunta = (id) => {
    console.log('exibir pergunta', id);
    document.getElementById(`pergunta-${id}`).style.display = 'block';
  }

  const esconderPergunta = (id) => {
    console.log('esconder pergunta', id);
    document.getElementById(`pergunta-${id}`).style.display = 'none';
  }

  const getPerfil = () => {
    if (pontos <= 40) {
      return 'ZUMBI';
    }

    if (pontos >= 41 && pontos <= 55) {
      return 'ESCRAVO';
    }

    if (pontos >= 56 && pontos <= 70) {
      return 'ESCASSO';
    }

    if (pontos >= 71 && pontos <= 85) {
      return 'ABUNDANTE';
    }

    if (pontos >= 86) {
      return 'TRANSBORDANTE';
    }

    return false;
  }

  const enviarResposta = async (event) => {
    try {
      if((perguntaAtual) <= 214) {
        notifyError('Por favor responda todas as perguntas.');
        return false;
      }

      // event.preventDefault();

      setIsProvaRespondida(true);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } catch (error) {
      console.log(error);
    }
  };

  const gravarAlternativa = async (perguntaId, respostaId) => {
    try {
      const objeto = {
        participantes_id : aluno.id,
        participantes_competicoes_id : prova.competicoes_id,
        respostas_id: respostaId,
        perguntas_id: perguntaId,
        provas_id: perguntas[0].provas_id
      }

      await api.post(`/participante/respostas`, objeto);
    } catch (error) {
      console.log(error);
    }
  }

  const informarEstado = (event) => {
    const estadoSelecionado = event.target.value;
    setEstado(estadoSelecionado);
    exibirCidades(estadoSelecionado);
  }

  const informarCidade = (event) => {
    const cidadeSelecionado = event.target.value;
    console.log(cidadeSelecionado);
    // setEstado(estadoSelecionado);
    // exibirCidades(estadoSelecionado);
  }

  const exibirCidades = async (estadoSelecionado) => {
    const { estados } = EstadosCidades;
    estados.map((estado) => {
      if (estado.sigla === estadoSelecionado) {
        setCidades(estado.cidades);
      }
    })
  }

  const abrirLink = () => {
    window.open("http://plataformagame.com.br/caronas-tanques");
  }

  const abrirLinkCompra = () => {
    window.open("https://www.eventx.com.br/ochamadoaconvocacaodosgenerais");
  }

  const abrirCadastro = () => {
    setIsAluno(false);
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
        <img src={"img/logo-caronas.png"} alt="O Chamado 2022" height="130"/>
      </div>
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="perguntaGeneral">
            Se seu carro tem vaga para alguns Generais
            Preencha as informações abaixo.
          </h1>
          <br />
          <h1 className="perguntaGeneral">
            Os Generais disponíveis entrarão em contato com você.
          </h1>
          <Form style={{ background: '#1a1a1a' }}>
            <fieldset>
              <Form.Group as={Row} className="mb-3">
                <Form.Control 
                  className="inputEmail"
                  type=""
                  placeholder="Seu nome"
                />
                <Form.Control 
                  className="inputEmail"
                  type=""
                  placeholder="Seu Whatsapp"
                />
                <Form.Control 
                  className="inputEmail"
                  type=""
                  placeholder="$$ Custo por cada General que vai com você"
                />
                <select id="estado" name="estado" className="estados" onChange={informarEstado}>
                  <option value="">Selecione seu estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                  <option value="EX">Estrangeiro</option>
              </select>

              <select id="cidade" name="cidade" className="estados" onChange={informarCidade}>
                  <option value="">Selecione sua cidade</option>
                  { cidades.length > 1 ? (
                    <>
                      {cidades.map((cidade) => {
                        return (
                          <>
                            <option value={`${cidade}`}>{`${cidade}`}</option>
                          </>
                        )
                      })}
                    </>
                  ) : ( <></> )}
              </select>
              </Form.Group>
              <div className="center">
                  <Form.Group as={Row} className="mb-3">
                    <Button
                      type="submit"
                      className="btnEnviarRespostas"
                      style={{ 
                        background: '#76793F',
                        borderColor: '#76793F'
                      }}
                    >
                      OFERECER&nbsp;CARONA
                    </Button>
                    <ToastContainer />
                  </Form.Group>
                </div>
            </fieldset>
          </Form>
        </Jumbotron>
      ) : (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="pergunta center tituloGenerais">
            Convocação dos Generais 
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            Encontre sua carona para “O Chamado”
            29 de dezembro - Goiânia
          </h1>
          <br/>
          <h1 className="perguntaGeneral center" style={{ fontWeight: 100 }}>
            Abaixo você tem duas opções: Dar carona para algum general,
            ou encontrar um batalhão que possa te levar ao evento. 
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            Clique no botão abaixo e bora tocar o terror!
          </h1>
          <br/>
          <div className="center">
            <Form.Group as={Row} className="mb-3" style={{ width: '100%' }}>
              <Button
                type="submit"
                className="btnEnviarRespostas"
                onClick={abrirCadastro}
                style={{ 
                  background: '#76793F',
                  borderColor: '#76793F',
                  width: '100%'
                }}
              >
                TENHO CARRO E QUERO DAR CARONA
              </Button>
              <ToastContainer />
            </Form.Group>
          </div>
          <h1 className="perguntaGeneral center">
            OU
          </h1>
          <div className="center">
            <Form.Group as={Row} className="mb-3" style={{ width: '100%' }}>
              <Button
                type="submit"
                className="btnEnviarRespostas"
                onClick={abrirLink}
                style={{ 
                  background: '#76793F',
                  borderColor: '#76793F',
                  width: '100%'
                }}
              >
                PRECISO DE CARONA
              </Button>
              <ToastContainer />
            </Form.Group>
          </div>
          <div className="center">
            <Form.Group as={Row} className="mb-3" style={{ width: '100%', paddingTop: '8px' }}>
              <Button
                type="submit"
                className="btnEnviarRespostas"
                onClick={abrirLinkCompra}
                style={{ 
                  background: '#cd0000',
                  borderColor: '#cd0000',
                  width: '100%'
                }}
              >
                NÃO TENHO INGRESSO, <br/>QUERO ADQUIRIR!
              </Button>
              <ToastContainer />
            </Form.Group>
          </div>
        </Jumbotron>
      )}
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
