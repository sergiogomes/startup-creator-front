import { React, useEffect, useState } from 'react';

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
  const [rankBloqueios, setRankBloqueios] = useState([]);

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova/2`);
      const { perguntas, respostas, prova } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
      setProva(prova);
    } catch (error) {
      console.log(error);
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
      getRankBloqueios();
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

  const validarEmail = async (event) => {
    try {
      event.preventDefault();
      if (!EmailValidator.validate(emailAluno.email)) {
        notifyError('Informe o seu email.');
        return;
      }

      await api.post(`/email/cadastrar/ip`, emailAluno).then((res) => {
        getProva();
        const { id } = res.data;
        setAluno({id});
        setIsAluno(true);
      });
    } catch (error) {
      notifyError('O email apresentado não faz parte da nossa base de alunos.');
      console.log(error);
      setIsAluno(false);
    }
  };

  const getRankBloqueios = async () => {
    try {

      await api.get(`/resultado/bloqueios/${aluno.id}`).then((res) => {
        setRankBloqueios(res.data);
      });
    } catch (error) {
      notifyError('O rank de bloqueios, não está disponivel no momento.');
      console.log(error);
      setIsAluno(false);
    }
  }

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
          <h1 className="pergunta">Email cadastrado na compra do MÉTODO IP</h1>
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
                    <Button type="submit" className="btnEnviarRespostasIP" onClick={validarEmail}>ACESSAR&nbsp;ENQUETE</Button>
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
                  <span style={{ 
                    backgroundColor: '#C2A98D', 
                    borderRadius: '5px', 
                    padding: '6px',
                    fontSize: '10px',
                    fontWeight: 'bolder'
                  }}>
                    {`${pergunta.categoria}`}
                  </span>
                  <br />
                  <br />
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
                <Button type="submit" className="btnEnviarRespostasIP" onClick={enviarResposta}>ENVIAR&nbsp;RESPOSTAS</Button>
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
