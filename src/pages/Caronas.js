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
  const [isAluno, setIsAluno] = useState(false);
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
    window.open("https://devzap.com.br/api-engennier/campanha/api/redirect/60888eb7001c7c0001c17933");
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
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="pergunta">Seu carro tem vaga para caroneiros? Deixei o seu cadastro.</h1>
          <Form style={{ background: '#1a1a1a' }}>
            <fieldset>
              <Form.Group as={Row} className="mb-3">
                <Form.Control 
                  className="inputEmail"
                  type=""
                  placeholder="Nome"
                />
                <Form.Control 
                  className="inputEmail"
                  type=""
                  placeholder="WhatsApp"
                />
                <Form.Control 
                  className="inputEmail"
                  type=""
                  placeholder="Custo R$ por pessoa"
                />
                <select id="estado" name="estado" className="estados" onChange={informarEstado}>
                  <option value="">Selecionar estado</option>
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
                  <option value="">Selecionar cidade</option>
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
        <>
        {!isProvaRespondida ? (
          <>
            <h1 className="nota center">CARONAS - O CHAMADO DOS GENERAIS!</h1>
          {perguntas.map((pergunta, i) => {
            return (
              <>
                <Jumbotron className="painel" id={`pergunta-${pergunta.id}`} style={{ background: '#1a1a1a', display: 'none' }}>
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
                                opcao={`${resposta.opcao}`}
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
            {/* <div className="center">
              <Form.Group as={Row} className="mb-3">
                <Button type="button" className="btnEnviarRespostas" onClick={enviarResposta}>ENVIAR&nbsp;RESPOSTAS</Button>
              </Form.Group>
            </div> */}
            <h1 className="nota center">Você não vai chegar até o final.</h1>
            <h1 className="nota center"></h1>

          </>
        ) : (
          <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
            <div className="">
              <h1 className="pergunta center tituloResultado">TESTE CONCLUÍDO</h1>
              <br />
              <h1 className="pergunta center">VOCÊ ESTÁ NA FASE: </h1>
              <h1 className="pergunta center perfil">{`${perfilSelecionado}`}</h1>

              {/* {perfilSelecionado === 'ZUMBI' ? (
                <Iframe url="http://www.youtube.com/embed/84iHW5laImM"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )}

              {perfilSelecionado === 'ESCRAVO' ? (
                <Iframe url="http://www.youtube.com/embed/84iHW5laImM"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )}

              {perfilSelecionado === 'ESCASSO' ? (
                <Iframe url="http://www.youtube.com/embed/84iHW5laImM"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )}

              {perfilSelecionado === 'ABUNDANTE' ? (
                <Iframe url="http://www.youtube.com/embed/84iHW5laImM"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )}

              {perfilSelecionado === 'TRANSBORDANTE' ? (
                <Iframe url="http://www.youtube.com/embed/84iHW5laImM"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )} */}

              <br />
              <br />
              <div className="center">
                <Form.Group as={Row} className="mb-3">
                  <Button className="btnEnviarRespostasWhats" onClick={abrirLink}>
                    <img className="logoBotaoWhats" src={"img/whatsapp-branco.png"} />
                    &nbsp;QUERO RECEBER OS CONTEÚDOS
                  </Button>
                  <ToastContainer />
                </Form.Group>
              </div>
              
              <h1 className="pergunta center">Grupo Fechado e Silencioso</h1>
            </div>

          </Jumbotron>
        )}
        </>
      )}
      <div className="centerImg">
        <img className="logoRotaDigital" src={"img/pablo1.png"} alt="Pablo Marçal"/>
      </div>

      <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-455561195"></script>
        <script>
          {`
            if (document.location.pathname.indexOf("/pior-semana-da-sua-vida-quizz") == 0) {
              console.log('pior-semana-da-sua-vida-quizz');

              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '608209829624734');
              fbq('track', 'PageView');
              fbq('track', 'Lead');

              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'AW-480840146');

              gtag('event', 'conversion', {'send_to': 'AW-480840146/-im6CMfzzoADENKTpOUB'});
            }
          `}
        </script>
      </Helmet>

      <noscript>
        <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=608209829624734&ev=PageView&noscript=1"
        />
      </noscript>
    </Container>
  );
};

export default Caronas;
