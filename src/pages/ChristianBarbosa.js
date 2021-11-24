import { React, useEffect, useState } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Iframe from 'react-iframe';

import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toasts';

import api from '../services/api';

import '../../src/ChristianBarbosa.css';

const ChristianBarbosa = () => {

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
  const [paginas, setPaginas] = useState([149, 150, 151, 152, 153, 154, 155, 156, 157, 158]);
  const [perguntaAtual, setPerguntaAtual] = useState(149);

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova/10`);
      const { perguntas, respostas, prova } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
      setProva(prova);
      exibirPergunta(149);
    } catch (error) {
      console.log(error);
      notifyError('Neste momento não tem prova disponivel! Fique atendo nas lives de terça!');
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
    if (perguntaAtual === 158) {
      enviarResposta();
      return;
    }

    if (perguntaAtual === 0) {
      exibirPergunta(149);
      setPerguntaAtual(149);
      return;
    }

    if (perguntaAtual >= 149) {
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
      return 'Seu 2022 está no caminho para ser um dos melhores anos.';
    }

    if (coprodutor > 0 && coprodutor === maiorValor) {
      return 'Você pode fazer 2022 ser ainda melhor.';
    }

    if (lancador > 0 && lancador === maiorValor) {
      return 'Você precisa urgentemente criar um 2022 melhor.';
    }

    return false;
  }

  const enviarResposta = async (event) => {
    try {
      if((expert + lancador + coprodutor) <= 8) {
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
    window.open("https://devzap.com.br/api-engennier/campanha/api/redirect/61805a7ac9ddf60001facee1");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  useEffect(() => {
    getProva();
  }, []);

  return (
    <Container className="p-3" style={{
      background: "linear-gradient(to right, #019CAD, #4880EC)",
      height: '100%'
    }}>
      <div className="centerImg">
        <img src={"img/logo-omat.png"} alt="OMAT" height="80"/>
      </div>
      {isAluno ? (
        <Jumbotron className="painel" style={{ background: '#595BDC' }}>
        </Jumbotron>
      ) : (
        <>
        {!isProvaRespondida ? (
          <>
            <h1 className="notaChristian center">DESCUBRA AGORA O QUE TE IMPEDE DE CONQUISTAR AS TÃO SONHADAS METAS DE ANO NOVO…</h1>
          {perguntas.map((pergunta, i) => {
            return (
              <>
                <Jumbotron className="painel" id={`pergunta-${pergunta.id}`} style={{ background: '#595BDC', display: 'none' }}>
                  <Form style={{ background: '#595BDC' }} onSubmit={handleSubmit}>
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
          </>
        ) : (
          <Jumbotron className="painel" style={{ background: '#595BDC' }}>
            <div className="">
              <h1 className="pergunta center tituloResultado">TESTE CONCLUÍDO</h1>
              <br />
              {/* <h1 className="pergunta center">SEU PERFIL DIGITAL É: </h1> */}
              <h1 className="pergunta center">{`${perfilSelecionado}`}</h1>

              {/* {perfilSelecionado === 'ESPECIALISTA' ? (
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
        <img className="logoRotaDigital" src={"img/logo-christian-barbosa.png"} alt="Rota Digital" />
      </div>
    </Container>
  );
};

export default ChristianBarbosa;
