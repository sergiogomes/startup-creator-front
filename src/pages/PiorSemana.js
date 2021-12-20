import { React, useEffect, useState } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Iframe from 'react-iframe';
import { Helmet } from "react-helmet";

import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toasts';

import api from '../services/api';

import '../../src/RotaDigital.css';

const PiorSemana = () => {

  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [prova, setProva] = useState('');
  const [isAluno, setIsAluno] = useState(false);
  const [aluno, setAluno] = useState({});
  const [isProvaRespondida, setIsProvaRespondida] = useState(false);
  const [pontos, setPontos] = useState(0);
  const [expert, setExpert] = useState(0);
  const [coprodutor, setCoprodutor] = useState(0);
  const [lancador, setLancador] = useState(0);
  const [perfilSelecionado, setPerfilSelecionado] = useState('Carregando...');
  const [paginas, setPaginas] = useState([209, 210, 211, 212, 213, 214, 215]);
  const [perguntaAtual, setPerguntaAtual] = useState(209);

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

  /*
    - Zumbi 0-40
    - Escravo 41-55
    - Escasso 56 - 70
    - Abundante 71 - 85
    - Transbordante 86 - 100
  */

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

  const abrirLink = () => {
    window.open("https://devzap.com.br/api-engennier/campanha/api/redirect/61bde6523559500001a471a8");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  useEffect(() => {
    getProva();
  }, []);

  return (
    <Container className="p-3" style={{ background: '#000' }}>
      <div className="centerImg">
        <img src={"img/pior-semana-branco.png"} alt="Pior Semana da sua vida 2022" height="80"/>
      </div>
      {isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
        </Jumbotron>
      ) : (
        <>
        {!isProvaRespondida ? (
          <>
            <h1 className="nota center">QUIZ PIOR ANO DA SUA VIDA!</h1>
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

              {perfilSelecionado === 'ZUMBI' ? (
                <Iframe url="https://www.youtube.com/embed/zcwPPenzuZM"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )}

              {perfilSelecionado === 'ESCRAVO' ? (
                <Iframe url="https://www.youtube.com/embed/gywYV1Iy9tc"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )}

              {perfilSelecionado === 'ESCASSO' ? (
                <Iframe url="https://www.youtube.com/embed/6Z_rn_VsP0k"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )}

              {perfilSelecionado === 'ABUNDANTE' ? (
                <Iframe url="https://www.youtube.com/embed/XIThgxA7KAA"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )}

              {perfilSelecionado === 'TRANSBORDANTE' ? (
                <Iframe url="https://www.youtube.com/embed/u2GIna418S0"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <></>
              )}

              <br />
              <br />
              <div className="center">
                <Form.Group as={Row} className="mb-3">
                  <Button className="btnEnviarRespostasWhats" onClick={abrirLink}>
                    <img className="logoBotaoWhats" src={"img/whatsapp-branco.png"} />
                    &nbsp;QUERO ACESSAR O GRUPO
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
        <img className="logoRotaDigital" src={"img/pablo1.png"} alt="Pablo Marçal" />
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

export default PiorSemana;
