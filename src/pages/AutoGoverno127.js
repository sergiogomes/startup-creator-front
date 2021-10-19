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
import Table from 'react-bootstrap/Table';

import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toasts';

import api from '../services/api';

import animationData from '../lottie/check.json';

import '../../src/AutoGoverno.css';

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
      const { data } = await api.get(`/prova/2`);
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

  const validarEmail  = async (event) => {
    try {
      event.preventDefault();
      if (!EmailValidator.validate(emailAluno.email)) {
        notifyError('Informe o seu email.');
        return;
      }

      await api.post(`/email/validar/ip`, emailAluno).then((res) => {
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
        <img src={"img/logo-ip.png"} alt="Método IP 127" height="40"/>
      </div>
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="pergunta">Email cadastrado no Método IP 127</h1>
          <Form style={{ background: '#1a1a1a' }}>
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
                    <Button type="submit" className="btnEnviarRespostas" onClick={validarEmail}>ACESSAR&nbsp;ENQUETE</Button>
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
            <h1 className="nota center">Enquete sobre BLOQUEIOS</h1>
          {perguntas.map((pergunta, i) => {
            return (
              <>
                <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
                  <Form style={{ background: '#1a1a1a' }} onSubmit={handleSubmit}>
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
            <div className="center">
              <Form.Group as={Row} className="mb-3">
                <Button type="submit" className="btnEnviarRespostas" onClick={enviarResposta}>ENVIAR&nbsp;RESPOSTAS</Button>
              </Form.Group>
            </div>
            <h1 className="nota center">Lembre-se: isso é só a sombra doque há de vir. #TMJADF</h1>
          </>
        ) : (
          <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
            <h1 className="pergunta center">Ranking de Bloqueios 🚫</h1>
            <Form style={{ background: '#1a1a1a' }}>
              <fieldset>
                <Form.Group as={Row} className="mb-3">
                  <Table striped bordered hover variant="dark" style={{ margin: "25px" }}>
                    <tbody>
                      <tr>
                        <td className="">1º</td>
                        <td className="">APRENDIZAGEM</td>
                        <td className="center">85%</td>
                      </tr>
                      <tr>
                        <td className="">2º</td>
                        <td className="">AUTOIMAGEM</td>
                        <td className="center">79%</td>
                      </tr>
                      <tr>
                        <td className="">3º</td>
                        <td className="">BLOQUEIO CRIATIVO</td>
                        <td className="center">71%</td>
                      </tr>
                      <tr>
                        <td className="">4º</td>
                        <td className="">COMPLEXO DE INFERIORIDADE</td>
                        <td className="center">70%</td>
                      </tr>
                      <tr>
                        <td className="">5º</td>
                        <td className="">CRÍTICAS</td>
                        <td className="center">60%</td>
                      </tr>
                      <tr>
                        <td className="">6º</td>
                        <td className="">CULPA</td>
                        <td className="center">59%</td>
                      </tr>
                      <tr>
                        <td className="">7º</td>
                        <td className="">DEPRESSÃO E ANSIEDADE</td>
                        <td className="center">45%</td>
                      </tr>
                      {/* <tr>
                        <td className="center">8) ESCASSEZ 41%</td>
                      </tr>
                      <tr>
                        <td className="center">9) MEDO DE ERRAR 39%</td>
                      </tr>
                      <tr>
                        <td className="center">10) PAIS DITADORES 38%</td>
                      </tr>
                      <tr>
                        <td className="center">11) PROCRASTINAÇÃO 35%</td>
                      </tr>
                      <tr>
                        <td className="center">12) REJEIÇÃO 20%</td>
                      </tr>
                      <tr>
                        <td className="center">13) RELIGIOSIDADE 18%</td>
                      </tr>
                      <tr>
                        <td className="center">14) SEXUAL 15%</td>
                      </tr>
                      <tr>
                        <td className="center">15) TIMIDEZ 13%</td>
                      </tr>
                      <tr>
                        <td className="center">16) VITIMISMO 4%</td>
                      </tr> */}
                    </tbody>
                  </Table>
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
