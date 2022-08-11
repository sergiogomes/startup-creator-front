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

const Dashboard = () => {

  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [respostaAluno, setRespostaAluno] = useState([]);
  const [prova, setProva] = useState('');
  const [isAluno, setIsAluno] = useState(false);
  const [aluno, setAluno] = useState({});
  const [isProvaRespondida, setIsProvaRespondida] = useState(false);
  const [rankBloqueios, setRankBloqueios] = useState([]);
  const [expert, setExpert] = useState(0);
  const [coprodutor, setCoprodutor] = useState(0);
  const [lancador, setLancador] = useState(0);
  const [perfilSelecionado, setPerfilSelecionado] = useState('Carregando...');
  const [paginas, setPaginas] = useState([132, 133, 134, 135, 136, 137, 138]);
  const [perguntaAtual, setPerguntaAtual] = useState(132);

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova/8`);
      const { perguntas, respostas, prova } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
      setProva(prova);
      exibirPergunta(132);
    } catch (error) {
      console.log(error);
    }
  };

  const salvarResposta = async (event) => {
    try {
      const opcao = event.target.getAttribute('opcao');

      if (opcao === 'A') {
        setExpert(expert + 1);
      }

      if (opcao === 'B') {
        setCoprodutor(coprodutor + 1);
      }

      if (opcao === 'C') {
        setLancador(lancador + 1);
      }
      exibirProximaPergunta();
      setPerfilSelecionado(getPerfil());
    } catch (error) {
      console.log(error);
    }
  };

  const exibirProximaPergunta = () => {
    if (perguntaAtual === 138) {
      enviarResposta();
      return;
    }

    if (perguntaAtual === 0) {
      exibirPergunta(132);
      setPerguntaAtual(132);
      return;
    }

    if (perguntaAtual >= 132) {
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
    console.log(Math.max(...[expert, coprodutor, lancador]));
    const maiorValor = Math.max(...[expert, coprodutor, lancador]);

    if (expert > 0 && expert === maiorValor) {
      return 'ESPECIALISTA';
    }

    if (coprodutor > 0 && coprodutor === maiorValor) {
      return 'COPRODUTOR';
    }

    if (lancador > 0 && lancador === maiorValor) {
      return 'LANÇADOR';
    }

    return false;
  }

  const enviarResposta = async (event) => {
    try {
      if((expert + lancador + coprodutor) <= 5) {
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
    window.open("https://devzap.com.br/api-engennier/campanha/api/redirect/6171aea830769c0001c9993b");
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
        <img src={"img/rota-digital-branco.png"} alt="Rota Digital" height="80"/>
      </div>
      {isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
        </Jumbotron>
      ) : (
        <>
        {!isProvaRespondida ? (
          <>
            <h1 className="nota center">TESTE DE APTIDÃO DIGITAL</h1>
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
            <h1 className="nota center">Descubra o caminho ideal para o seu sucesso na internet.</h1>
            <h1 className="nota center"></h1>

          </>
        ) : (
          <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
            <div className="">
              <h1 className="pergunta center tituloResultado">TESTE CONCLUÍDO</h1>
              <br />
              <h1 className="pergunta center">SEU PERFIL DIGITAL É: </h1>
              <h1 className="pergunta center perfil">{`${perfilSelecionado}`}</h1>

              {perfilSelecionado === 'ESPECIALISTA' ? (
                <Iframe url="http://www.youtube.com/embed/84iHW5laImM"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              ) : (
                <Iframe url="http://www.youtube.com/embed/EYmUMUPf0DA"
                  width="100%"
                  height="450px"
                  display="initial"
                  position="relative"
                />
              )}

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
        <img className="logoRotaDigital" src={"img/mp-branco.png"} alt="Rota Digital" />
      </div>

      <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-455561195"></script>
        <script>
          {`
            if (document.location.pathname.indexOf("/teste-rota-digital") == 0) {
              console.log('teste-rota-digital');

              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '146287563581051');
              fbq('track', 'PageView');
              fbq('track', 'Lead');

              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'AW-455561195');

              gtag('event', 'conversion', {'send_to': 'AW-455561195/NWLjCPmR_4ADEOufndkB'});
            }
          `}
        </script>
      </Helmet>

      <noscript>
        <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=146287563581051&ev=PageView&noscript=1"
        />
      </noscript>
    </Container>
  );
};

export default Dashboard;
