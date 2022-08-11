import { React, useEffect, useState } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as EmailValidator from 'email-validator';
import { Helmet } from "react-helmet";

import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toasts';

import api from '../services/api';

import '../../src/RotaDigital.css';

import { validate } from 'gerador-validador-cpf';

const ComoEnriquecer = () => {

  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [prova, setProva] = useState('');
  const [isAluno, setIsAluno] = useState(true);
  const [respostaAluno, setRespostaAluno] = useState([]);
  const [aluno, setAluno] = useState({});
  const [isProvaRespondida, setIsProvaRespondida] = useState(false);
  const [expert, setExpert] = useState(0);
  const [coprodutor, setCoprodutor] = useState(0);
  const [lancador, setLancador] = useState(0);
  const [perfilSelecionado, setPerfilSelecionado] = useState('Carregando...');
  const [paginas, setPaginas] = useState([231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246]);
  const [perguntaAtual, setPerguntaAtual] = useState(231);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova/18`);
      const { perguntas, respostas, prova } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
      setProva(prova);
      exibirPergunta(231);
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
      exibirProximaPergunta();
    } catch (error) {
      console.log(error);
    }
  };

  const exibirProximaPergunta = () => {
    if (perguntaAtual === 246) {
      enviarResposta();
      return;
    }

    if (perguntaAtual === 0) {
      exibirPergunta(231);
      setPerguntaAtual(231);
      return;
    }

    if (perguntaAtual === 170) {
      exibirPergunta(perguntaAtual + 2);
      setPerguntaAtual(perguntaAtual + 2);
      esconderPergunta(perguntaAtual);
      return;
    }

    if (perguntaAtual >= 231) {
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

  const enviarResposta = async (event) => {
    try {
      // if((expert + lancador + coprodutor) <= 8) {
      //   notifyError('Por favor responda todas as perguntas.');
      //   return false;
      // }

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
    window.open("https://devzapp.com.br/api-engennier/campanha/api/redirect/62167b468135b00001a0b5e4");
  }

  const gravarNome = async (event) => {
    const nomeFormulario = event.target.value;
    setNome(nomeFormulario);
  }

  const gravarEmail = async (event) => {
    const emailFormulario = event.target.value;
    setEmail(emailFormulario);
  }

  const gravarWhatsapp = async (event) => {
    const whatsapp = event.target.value;
    setWhatsapp(whatsapp);
  }

  const gravarInstagram = async (event) => {
    const instagram = event.target.value;
    setInstagram(instagram);
  }

  const cadastrarParticipante = async () => {
    console.log(nome, email, whatsapp, instagram);

    if (!nome) {
      notifyError('O nome é obrigatório');
      return;
    }

    if (!email) {
      notifyError('O email é obrigatório');
      return;
    }

    if (!EmailValidator.validate(email)) {
      notifyError('Digite um email válido');
      return;
    }

    if (!whatsapp) {
      notifyError('O whatsapp é obrigatório');
      return;
    }

    if (!instagram) {
      notifyError('O instagram é obrigatório');
      return;
    }

    try {
      await api.post(`/rotadigital/participante`, {
        email,
        nome,
        whatsapp,
        instagram
      }).then((res) => {
        getProva();
        const { id } = res.data;
        setAluno({id});
        setIsAluno(false);
      });
    } catch (error) {
      console.log(error.message, error.code);
      notifyError('Dados utilizados a prova pode ser realizada apenas uma vez!');
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  useEffect(() => {
    // getProva();
  }, []);

  return (
    <Container className="p-3">
      <div className="centerImg">
        <img src={"img/logo-como-enriquecer.png"} alt="Rota Digital" height="250"/>
      </div>
      {isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="tituloUm">
              Participe da prova, <strong> acerte 85% ou mais </strong> das questões relacionadas ao evento e concorra a uma das vagas no Game Show.
          </h1>
          <br />
          <h1 className="center" style={{ color: '#FFFF' }}>
              <span style={{ color: '#FFD37D' }}>200 MIL REAIS</span>&nbsp; em prêmios!
          </h1>
          <br />
          <h1 className="center tituloDois">
            Preencha as informações abaixo e participe.
          </h1>
          <h1 className="center tituloDois">
            Mas atenção, a prova pode ser feita somente uma vez! 
          </h1>
          <Form>
            <Form.Group className="mb-3 pergunta" controlId="formBasicEmail">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="nome" placeholder="" onChange={gravarNome} />
              <br />
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="" onChange={gravarEmail} />
              <br />
              <Form.Label>WhatsApp</Form.Label>
              <Form.Control type="whatsapp" placeholder="" onChange={gravarWhatsapp} />
              <br />
              <Form.Label>Instagram</Form.Label>
              <Form.Control type="instagram" placeholder="" onChange={gravarInstagram} />
              <br />
              {/* <Form.Text className="center">
                <strong>PROVA ENCERRADA</strong>
              </Form.Text>
              <Form.Text className="center">
                O resultado do sorteio será na aula de hoje (05/12), às 22:30, e o 
                link será liberado para quem estiver no grupo de WhatsApp. 
              </Form.Text>
              <br />
              <Form.Text className="center">
                É imprescindível que você esteja presente. Se você for contemplado e não estiver assistindo a aula, 
                vamos sortear outra pessoa. 
              </Form.Text> */}
            </Form.Group>
            <br />
            <div className="center">
              <Button variant="primary btnEnviarRespostasWhats" type="button" onClick={cadastrarParticipante} >
                INICIAR QUIZ
              </Button>
            </div>
          </Form>
        </Jumbotron>
      ) : (
        <>
        {!isProvaRespondida ? (
          <>
            {/* <h1 className="nota center">PROVA ELIMINATÓRIA PARA O SORTEIO</h1> */}
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
            {/* <h1 className="nota center">Descubra o caminho ideal para o seu sucesso na internet.</h1> */}
            <h1 className="nota center"></h1>
          </>
        ) : (
          <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
            <div className="">
              <h1 className="pergunta center tituloResultado">PARABÉNS, PROVA CONCLUÍDA!</h1>
              <br />
              <h1 className="pergunta center">O gabarito e os escolhidos para participar da Final serão revelados na live do instagram @eusoumarcospaulo sexta (18/03) às 19:00h.</h1>
              <br />
              <h1 className="pergunta center">Entre no grupo exclusivo do Quiz para ser avisado com antecedência.</h1>
              <br />
              <h1 className="pergunta center">
                Entre no grupo para ser avisado: 
              </h1>
              <br />
              <div className="center">
                <Form.Group as={Row} className="mb-3">
                  <Button className="btnEnviarRespostasTelegram" onClick={abrirLink}>
                    {/* <img className="logoBotaoWhats" src={"img/whatsapp-branco.png"} /> */}
                    Toque aqui para entrar no grupo
                  </Button>
                  <ToastContainer />
                </Form.Group>
              </div>
            </div>

          </Jumbotron>
        )}
        </>
      )}
      <div className="centerImg">
        <img className="logoRotaDigital" src={"img/mp-branco.png"} alt="Rota Digital" />
      </div>

      <Helmet>
      {`
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NXTWSDG"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
        </noscript>
      `}
      </Helmet>
    </Container>
  );
};

export default ComoEnriquecer;
