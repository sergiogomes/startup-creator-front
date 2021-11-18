import { React, useEffect, useState } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova/8`);
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
      setPerfilSelecionado(getPerfil());
    } catch (error) {
      console.log(error);
    }
  };

  const getPerfil = () => {
    console.log(Math.max(...[expert, coprodutor, lancador]));
    const maiorValor = Math.max(...[expert, coprodutor, lancador]);

    if (expert > 0 && expert === maiorValor) {
      return 'EXPERT';
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
      if((expert + lancador + coprodutor) <= 6) {
        notifyError('Por favor responda todas as perguntas.');
        return false;
      }

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

  const abrirLink = () => {
    window.open("https://devzap.com.br/api-engennier/campanha/api/redirect/6171aea830769c0001c9993b");
  }

  const getRankBloqueios = async () => {
    try {

      await api.get(`/resultado/bloqueios/${aluno.id}`).then((res) => {
        setRankBloqueios(res.data);
      });
    } catch (error) {
      notifyError('O resultado ainda não está disponivel.');
      console.log(error);
      setIsAluno(false);
    }
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
        <img src={"img/rota-digital-branco.png"} alt="Método IP 127" height="80"/>
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
            <div className="center">
              <Form.Group as={Row} className="mb-3">
                <Button type="submit" className="btnEnviarRespostas" onClick={enviarResposta}>ENVIAR&nbsp;RESPOSTAS</Button>
              </Form.Group>
            </div>
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
              
              <br />
              <h1 className="pergunta center descricaoResultado">Hoje existem milhares de oportunidades na internet para pessoas que possuem esse mesmo perfil.</h1>

              <br />
              <h1 className="pergunta center descricaoResultado">E seguindo a rota correta você aumenta as suas chances de fazer muito dinheiro nesse universo. Se quiser aprender como se tornar uma dessas pessoas…</h1>

              <br />
              <h1 className="pergunta center descricaoResultado">Toque no botão abaixo e entre no meu Grupo Exclusivo para ter acessos a e-books gratuitos e outro conteúdos que vão te ajudar a ter sucesso no mercado digital.</h1>
              
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
    </Container>
  );
};

export default Dashboard;
