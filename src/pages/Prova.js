import { React, useEffect, useState } from 'react';

import Lottie from 'react-lottie';
import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

import * as EmailValidator from 'email-validator';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toasts';

import api from '../services/api';

import animationData from '../lottie/check.json';

import '../../src/App.css';

const Dashboard = () => {

  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [respostaAluno, setRespostaAluno] = useState([]);
  const [emailAluno, setEmailAluno] = useState('');
  const [prova, setProva] = useState('');
  const [isAluno, setIsAluno] = useState(false);
  const [aluno, setAluno] = useState({});
  const [isProvaRespondida, setIsProvaRespondida] = useState(false);

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova`);
      const { perguntas, respostas, prova } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
      setProva(prova);
    } catch (error) {
      console.log(error);
      notifyError('Neste momento não tem prova disponivel! Fique atendo nas lives de terça!');
    }
  };

  const salvarResposta = async (event) => {
    try {
      const resposta = {
        perguntaId : event.target.name,
        respostaId : event.target.value 
      };

      gravarAlternativa(resposta.perguntaId, resposta.respostaId);

      setRespostaAluno(respostaAluno => [...respostaAluno, resposta]);
    } catch (error) {
      console.log(error);
    }
  };

  const salvarEmailAluno  = async (event) => {
    try {
      const email = event.target.value;

      setEmailAluno({...emailAluno, email});
    } catch (error) {
      console.log(error);
    }
  };

  const enviarResposta = async (event) => {
    try {
      event.preventDefault();
      setIsProvaRespondida(true);
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

  const gravarCodigoLive = async (event) => {
    try {
      const objeto = {
        participantes_id : aluno.id,
        codigo: event.target.value
      }

      if (objeto.codigo.length === 4) {
        await api.post(`/codigos/live`, objeto);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const validarEmail  = async (event) => {
    try {
      event.preventDefault();
      if (!EmailValidator.validate(emailAluno.email)) {
        notifyError('Informe o seu email.');
        return;
      }

      await api.post(`/email/validar`, emailAluno).then((res) => {
        getProva();
        const { participante } = res.data;
        setAluno(participante);
        setIsAluno(true);
      });
    } catch (error) {
      notifyError('O email apresentado não faz parte da nossa base de alunos.');
      console.log(error);
      setIsAluno(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  useEffect(() => {
    const analytics = Analytics({
      app: 'prova-cdr-123',
      plugins: [
        googleAnalytics({
          trackingId: 'G-P3DRTL8QKN'
        })
      ]
    });
    
    analytics.page();
  }, []);

  return (
    <Container className="p-3" style={{ background: '#000' }}>
      <div className="centerImg">
        <img src={"img/CDR600x300.png"} alt="A Ciência da Riqueza" height="75"/>
      </div>
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#8c6531' }}>
          <h1 className="pergunta">Informe o email cadastrado no curso:</h1>
          <Form style={{ background: '#8c6531' }}>
            <fieldset>
              <Form.Group as={Row} className="mb-3">
                <Form.Control 
                  className="inputEmail"
                  type="email"
                  placeholder="Digite aqui..."
                  onChange={salvarEmailAluno}
                />
              </Form.Group>
              <div className="center">
                  <Form.Group as={Row} className="mb-3">
                    <Button type="submit" className="btnEnviarRespostasProva" onClick={validarEmail}>ACESSAR&nbsp;PROVA</Button>
                    <ToastContainer />
                  </Form.Group>
                </div>
            </fieldset>
          </Form>
        </Jumbotron>
      ) : (
        <>
        {!isProvaRespondida ? (
          <>
            <h1 className="nota center">A prova 4 estará disponível entre os dias 06 até 08 de novembro, às 23H59.</h1>
          {perguntas.map((pergunta, i) => {
            return (
              <>
                <Jumbotron className="painel" style={{ background: '#8c6531' }}>
                  <Form style={{ background: '#8c6531' }} onSubmit={handleSubmit}>
                  <h1 className="pergunta">{`${i + 1}) ${pergunta.pergunta}`}</h1>
                  <fieldset className="alternativasRadius">
                    <Form.Group as={Row} className="mb-3">
                        <Col sm={10}>
                          {respostas.map((resposta, i) => {
                            if (pergunta.id !== resposta.perguntas_id) {
                              return <></>;
                            }
                            return (
                              <>
                                <Form.Check
                                style={{ color: '#fff' }}
                                type="radio"
                                key={i}
                                label={`${resposta.opcao}) ${resposta.resposta}`}
                                onChange={salvarResposta}
                                name={`${pergunta.id}`}
                                value={`${resposta.id}`}
                                id={`formHorizontalRadios${resposta.id}`}
                                className="alternativa" />
                              </>
                            )
                          })}
                        </Col>
                      </Form.Group>
                    </fieldset>
                  </Form>
                </Jumbotron>
              </>
              )
            })}
            <Jumbotron className="painel" style={{ background: '#8c6531' }}>
              <Form style={{ background: '#8c6531' }} onSubmit={handleSubmit}>
                <h1 className="pergunta">Insira o código da live informado no dia 05 de novembro de 2021:</h1>
                <fieldset className="alternativasRadius">
                  <Form.Group as={Row} className="mb-3">
                    <Form.Control
                      placeholder=""
                      style={{ textTransform: 'uppercase' }}
                      type="email"
                      maxLength="4"
                      className="inputCodigo"
                      onChange={gravarCodigoLive}
                    />
                  </Form.Group>
                </fieldset>
              </Form>
            </Jumbotron>
            <div className="center">
              <Form.Group as={Row} className="mb-3">
                <Button type="submit" className="btnEnviarRespostasProva" onClick={enviarResposta}>ENVIAR&nbsp;RESPOSTAS</Button>
              </Form.Group>
            </div>
            <h1 className="nota center">Lembre-se: isso é só a sombra do que há de vir. #TMJADF</h1>
          </>
        ) : (
          <Jumbotron className="painel" style={{ background: '#8c6531' }}>
            <h1 className="pergunta center">Prova finalizada!</h1>
            <h1 className="pergunta center">Valeu seu Rico e sua Rica.</h1>
            <Form style={{ background: '#8c6531' }}>
              <fieldset>
                <Form.Group as={Row} className="mb-3">
                <Lottie
                  options={defaultOptions}
                  height={400}
                  width={400}
                  isStopped={false}
                  isPaused={false}
                />
                </Form.Group>
              </fieldset>
            </Form>
          </Jumbotron>
        )}
        </>
      )}
      <div className="centerImg">
        <img className="logoPablo" src={"img/pablo1.png"} alt="A Ciência da Riqueza"/>
      </div>
    </Container>
  );
};

export default Dashboard;
