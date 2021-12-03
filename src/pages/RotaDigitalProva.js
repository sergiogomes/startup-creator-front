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

const RotaDigitalProva = () => {

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
  const [paginas, setPaginas] = useState([169, 170, 171, 172, 173, 174, 175, 176, 177, 178]);
  const [perguntaAtual, setPerguntaAtual] = useState(169);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova/12`);
      const { perguntas, respostas, prova } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
      setProva(prova);
      exibirPergunta(169);
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
      exibirProximaPergunta();
    } catch (error) {
      console.log(error);
    }
  };

  const exibirProximaPergunta = () => {
    if (perguntaAtual === 178) {
      enviarResposta();
      return;
    }

    if (perguntaAtual === 0) {
      exibirPergunta(169);
      setPerguntaAtual(169);
      return;
    }

    if (perguntaAtual >= 169) {
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

      console.log(objeto);

      await api.post(`/participante/respostas`, objeto);
    } catch (error) {
      console.log(error);
    }
  }

  const abrirLink = () => {
    window.open("https://devzap.com.br/api-engennier/campanha/api/redirectlink/61980a40ccda18000126b49e");
  }

  const gravarNome = async (event) => {
    const nomeFormulario = event.target.value;
    setNome(nomeFormulario);
  }

  const gravarEmail = async (event) => {
    const emailFormulario = event.target.value;
    setEmail(emailFormulario);
  }

  const gravarTelefone = async (event) => {
    const telefoneFormulario = event.target.value;
    setTelefone(telefoneFormulario);
  }

  const gravarCPF = async (event) => {
    const cpfFormulario = event.target.value;
    setCpf(cpfFormulario);
  }

  const cadastrarParticipante = async () => {
    console.log(nome, email, telefone, cpf);

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

    if (!telefone) {
      notifyError('O telefone é obrigatório');
      return;
    }

    if (!cpf) {
      notifyError('O cpf é obrigatório');
      return;
    }

    if (!validate(cpf)) {
      notifyError('CPF inválido');
      return;
    }

    try {
      await api.post(`/rotadigital/participante`, {
        email,
        nome,
        telefone,
        cpf
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
    <Container className="p-3" style={{ background: '#000' }}>
      <div className="centerImg">
        <img src={"img/rota-digital-branco.png"} alt="Rota Digital" height="80"/>
      </div>
      {isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="tituloUm">
            Participe da prova, <strong> acerte 80% ou 
            mais</strong> das questões relacionadas ao evento e concorra a um &nbsp;
            <span className="italicoSublinhado">
              Macbook, um IPhone e uma vaga no LX Club.
            </span>
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
              <Form.Label>Telefone</Form.Label>
              <Form.Control type="telefone" placeholder="" onChange={gravarTelefone} />
              <br />
              <Form.Label>CPF</Form.Label>
              <Form.Control type="cpf" placeholder="" onChange={gravarCPF} />
              <br />
              <Form.Text className="center">
                O resultado do sorteio será na aula de domingo (05/12), às 22:30, e o 
                link será liberado para quem estiver no grupo de WhatsApp. 
              </Form.Text>
              <br />
              <Form.Text className="center">
                É imprescindível que você esteja presente. Se você for contemplado e não estiver assistindo a aula, 
                vamos sortear outra pessoa.
              </Form.Text>
            </Form.Group>
            <br />
            <div className="center">
              <Button variant="primary btnEnviarRespostasWhats" type="button" onClick={cadastrarParticipante}>
                INICIAR PROVA
              </Button>
            </div>
          </Form>
        </Jumbotron>
      ) : (
        <>
        {!isProvaRespondida ? (
          <>
            <h1 className="nota center">PROVA ELIMINATÓRIA PARA O SORTEIO</h1>
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
            <h1 className="nota center">Descubra o caminho ideal para o seu sucesso na internet.</h1>
            <h1 className="nota center"></h1>
          </>
        ) : (
          <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
            <div className="">
              <h1 className="pergunta center tituloResultado">PARABÉNS, PROVA CONCLUÍDA!</h1>
              <br />
              <h1 className="pergunta center">O sorteio será efetuado na Aula de Domingo, às 22:30, e o link será enviado para quem estiver no grupo de WhatsApp!</h1>
              <br />
              <h1 className="pergunta center">
                Se você não está no grupo entre agora 
                mesmo para acompanhar as informações.
              </h1>
              <br />
              <div className="center">
                <Form.Group as={Row} className="mb-3">
                  <Button className="btnEnviarRespostasWhats" onClick={abrirLink}>
                    <img className="logoBotaoWhats" src={"img/whatsapp-branco.png"} />
                    &nbsp;&nbsp;Toque aqui para entrar no grupo
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

export default RotaDigitalProva;
