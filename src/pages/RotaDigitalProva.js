import { React, useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from "reactstrap";
import {Helmet} from "react-helmet";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Iframe from 'react-iframe';
import * as EmailValidator from 'email-validator';


import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toasts';

import api from '../services/api';

import '../../src/RotaDigital.css';

import { validate } from 'gerador-validador-cpf';
import { Script } from 'react-inline-script';

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
  const [perfilSelecionado2, setPerfilSelecionado2] = useState('Carregando...');
  const [perfilSelecionado3, setPerfilSelecionado3] = useState('Carregando...');
  const [paginas, setPaginas] = useState([247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273]);
  const [perguntaAtual, setPerguntaAtual] = useState(247);
  const [resultado, setResultado] = useState({});

  

  const [nome, setNome] = useState('teste');
  const [email, setEmail] = useState('teste@gmail.com');
  const [telefone, setTelefone] = useState('11923456781');
  const [cpf, setCpf] = useState('482.089.280-03');

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova/19`);
      const { perguntas, respostas, prova } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
      setProva(prova);
      exibirPergunta(247);
    } catch (error) {
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
    if (perguntaAtual === 273) {
      enviarResposta();
      return;
    }

    if (perguntaAtual === 0) {
      exibirPergunta(247);
      setPerguntaAtual(247);
      return;
    }

    if (perguntaAtual === 170) {
      exibirPergunta(perguntaAtual + 2);
      setPerguntaAtual(perguntaAtual + 2);
      esconderPergunta(perguntaAtual);
      return;
    }

    if (perguntaAtual >= 247) {
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
     const retorno = await api.get(`/resultado/rotadigital/${aluno.id}`, );
     setResultado(retorno);
     setPerfilSelecionado(retorno.data[0].categoria)
     setPerfilSelecionado2(retorno.data[1].categoria)
     setPerfilSelecionado3(retorno.data[2].categoria)
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
    window.open("https://chat.whatsapp.com/Hh2RuCqYokf1JfpTQV13ce");
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
    cadastrarParticipante();
    getProva();
    setIsAluno(false);
  }, []);

  return (
    <Container className="p-3">
      <div className="centerImg">
        <img src={"img/RD_Logotipo.png"} alt="Renda Digital" height="160" style={{ paddingRight: '64px' }}/>
      </div>
      {isAluno ? (
        <Jumbotron display="none" style={{ background: '#1a1a1a' }}>
          {/* <h1 className="tituloUm">
            Participe da prova, <strong> acerte 80% ou 
            mais</strong> das questões relacionadas ao evento e concorra a um &nbsp;
            <span className="italicoSublinhado">
              Macbook, um IPhone e uma vaga no LX Club.
            </span>
          </h1> */}
          {/* <br /> */}
          {/* <h1 className="center tituloUm">
           Está perdido e não sabe como construir uma Renda Digital? 
          </h1>
          <br />
          <h1 className="center tituloDois">
             Deixe seus dados abaixo, faça o Quiz gratuitamente e <br /> descubra 
             qual o melhor caminho para ter sucesso na internet. 
          </h1>
          <Form>
            <Form.Group className="mb-3 pergunta" controlId="formBasicEmail">
              <br />
              <Form.Label>DEIXE SEU MELHOR EMAIL</Form.Label>
              <Form.Control className="w-50" type="email" placeholder="" onChange={gravarEmail} />

            </Form.Group>
            <br />
            <div className="center">
              <Button variant="primary btnEnviarRespostasWhats" type="button" onClick={cadastrarParticipante}>
              QUERO DESCOBRIR MINHA PROFISSÃO DIGITAL
              </Button>
            </div>
          </Form> */}
        </Jumbotron>
      ) : (
        <>
        {!isProvaRespondida ? (
          <>
            {/* <h1 className="nota center">QUIZ</h1> */}
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
          </>
        ) : (
          <Jumbotron className="painel painelresultado" style={{ background: '#1a1a1a' }}> 


<Script>
  {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1154748838448553');
fbq('track', 'CompleteRegistration');
`}
</Script>


            <h1 className="pergunta center tituloResultado">TESTE CONCLUÍDO</h1>
            <h1 className="nota center">
                Parabéns! Analisei os dados do seu perfil e aqui abaixo estão as <br />
                profissões digitais que mais combinam com você.
            </h1>

            <br />

            <h1 className="pergunta center profissao">PROFISSÃO PRIMÁRIA: </h1>
            <h1 className="pergunta center perfil">{`${perfilSelecionado}`}</h1>

            <br />
            {perfilSelecionado === 'Afiliado' ? (
               <div  className="nota center">
                <Iframe id="panda-57a69341-0c85-4304-91e3-527d203d28c2"
                  src="https://player-vz-c0e328be-02b.tv.pandavideo.com.br/embed/?v=57a69341-0c85-4304-91e3-527d203d28c2" 
                  style="border:none;position:absolute;top:0;left:0;" 
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                  width="720" 
                  height="360">
                </Iframe>
              </div>
              ) :  (
                <>
                
                </>
              )}
              {perfilSelecionado === 'Copywriter' ? (
              <div  className="nota center">
                  <Iframe id="panda-43d200e3-2143-428d-8d2a-9b5e43e5d1ce" 
                    src="https://player-vz-c0e328be-02b.tv.pandavideo.com.br/embed/?v=43d200e3-2143-428d-8d2a-9b5e43e5d1ce" 
                    style="border:none;position:absolute;top:0;left:0;" 
                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture" 
                    width="720" 
                    height="360">
                 </Iframe>
               </div>
                 ) :  (
                  <>
                    
                  </>
               )}
               {perfilSelecionado === 'e-commerce' ? (
             <div  className="nota center">
                <Iframe id="panda-57a69341-0c85-4304-91e3-527d203d28c2"
                src="https://player-vz-c0e328be-02b.tv.pandavideo.com.br/embed/?v=57a69341-0c85-4304-91e3-527d203d28c2" 
                style="border:none;position:absolute;top:0;left:0;" 
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                width="720" 
                height="360">
                </Iframe>
              </div>
                ) :  (
                  <>
                   
                  </>
                )}
                {perfilSelecionado === 'Especialista' ? (
               <div  className="nota center">
                <Iframe id="panda-1341cd87-db0d-4951-a1d3-74dd2b8b3fe3" 
                  src="https://player-vz-c0e328be-02b.tv.pandavideo.com.br/embed/?v=1341cd87-db0d-4951-a1d3-74dd2b8b3fe3" 
                  style="border:none;position:absolute;top:0;left:0;" 
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                  width="720" 
                  height="360">
                </Iframe>
              </div>
              ) : (
                <>
                  
                </>
                )}
                {perfilSelecionado === 'Gestor de Redes Sociais' ? (
             <div  className="nota center">
                <Iframe id="panda-3fe00a47-525b-44ea-bc32-79269e05a897" 
                  src="https://player-vz-c0e328be-02b.tv.pandavideo.com.br/embed/?v=3fe00a47-525b-44ea-bc32-79269e05a897" 
                  style="border:none;position:absolute;top:0;left:0;" 
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture" 
                  width="720" 
                  height="360">
                </Iframe>
              </div>
               ) : (
                <>
               
                </>
               )}
               {perfilSelecionado === 'Gestor de Tráfego' ? (
               <div  className="nota center">
                <Iframe id="panda-e472e9a7-bf3b-475f-9b30-01e64f1324d6" 
                  src="https://player-vz-c0e328be-02b.tv.pandavideo.com.br/embed/?v=e472e9a7-bf3b-475f-9b30-01e64f1324d6" 
                  style="border:none;position:absolute;top:0;left:0;" 
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                  width="720" 
                  height="360">
              </Iframe>
             </div>
              ) : (
              <>
               
              </>
                )}

{perfilSelecionado === 'Lançador ou Estrategista' ? (
                <div className='nota center'>
                  <Iframe id="panda-e2e992d3-f85b-4d2d-bf1a-66f949f24693" 
                    src="https://player-vz-c0e328be-02b.tv.pandavideo.com.br/embed/?v=e2e992d3-f85b-4d2d-bf1a-66f949f24693" 
                    style="border:none;position:absolute;top:0;left:0;" 
                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                    width="720" 
                    height="360">
                  </Iframe>
                </div>
                ) : (
                  <>
                
                 </>
                 )}
                 {perfilSelecionado === 'Designer ou Videomaker' ? (
              <div  className="nota center">
                <Iframe id="panda-5ed04bb4-fac6-43f5-a2bc-3e5af9ac82fb" 
                  src="https://player-vz-c0e328be-02b.tv.pandavideo.com.br/embed/?v=5ed04bb4-fac6-43f5-a2bc-3e5af9ac82fb" 
                  style="border:none;position:absolute;top:0;left:0;" 
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                  width="720" 
                  height="360">
                </Iframe>
              </div>
               ) : (
                <>
               
               </>
              )}
              {perfilSelecionado === 'Webdesigner' ? (
                <div  className="nota center">
                  <Iframe id="panda-0fe47caa-b9fc-4816-ae91-c6f9495f994e" 
                    src="https://player-vz-c0e328be-02b.tv.pandavideo.com.br/embed/?v=0fe47caa-b9fc-4816-ae91-c6f9495f994e" 
                    style="border:none;position:absolute;top:0;left:0;" 
                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                    width="720" 
                    height="360">
                  </Iframe>
                </div>
                 ) : (
                  <>
                  
                 </>
                )}

            <br />
            <h1 className="nota center">Toque no botão abaixo e entre no meu Grupo Vip, lá você vai aprender a desenvolver essa habilidade digital para, assim, começar a faturar R$ 10.000 por mês trabalhando pela internet. </h1>
                        
            <br />
            <div className="center">
              <Form.Group as={Row} className="mb-3">
                <Button className="btnEnviarRespostasWhats" onClick={abrirLink}>
                  <img className="logoBotaoWhats" src={"img/whatsapp-branco.png"} />
                  &nbsp;QUERO ENTRAR NO GRUPO VIP
                </Button>
                <ToastContainer />
              </Form.Group>
            </div>
            <br />
            <h1 className="pergunta center profissao">PROFISSÃO SECUNDÁRIA: </h1>
            <h1 className="pergunta center perfil">{`${perfilSelecionado2}`}</h1>
            <div  className="nota center">
            { perfilSelecionado2 === 'Afiliado'  ? (
              <>
               {perfilSelecionado === 'Afiliado' ? (
               <div  className="nota center">
                
              </div>
              ) :  (
                <>
                </>
              )}
              <div style={{bordeRadius: 10}} className="nota center">
                  <p>
                    O afiliado é alguém que divulga produtos e serviços de outras pessoas na internet e, em troca dessa
                    indicação para outras pessoas, o afiliado recebe uma comissão por cada venda realizada.
                  </p>
                </div>
              </>
             
              ) : (
                <>
                </>
            )}
            </div>
            { perfilSelecionado2 === 'Copywriter'  ? (
              <>
               {perfilSelecionado === 'Copywriter' ? (
              <div  className="nota center">
                  
               </div>
                 ) :  (
                  <>
                  </>
               )}
               <div style={{bordeRadius: 10}} className="nota center">
                  <p>Copywriter é a pessoa que escreve textos persuasivos com o objetivo de despertar no leitor a tomada de uma ação, seja ela uma curtida, um email ou a própria venda. </p>
                </div>
              </>
               
              ) : (
              <>
              </>
            )}
           
           {perfilSelecionado2 === 'e-commerce'  ? (
            <>
            {perfilSelecionado === 'e-commerce' ? (
             <div  className="nota center">
            
              </div>
                ) :  (
                  <>
                  </>
                )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                  <p>
                    O gestor / dono de e-Commerce é aquele perfil profissional responsável por um 
                    comércio eletrônico ou loja online de uma empresa, até mesmo sua própria. 
                    Essa pessoa teria como objetivo do e-Commerce elaborar estratégias de criação e de vendas para lojas online.
                  </p>
                </h5>
                
                  
                </div>
            </>
              ) : (
              <>
              </>
            )}
            { perfilSelecionado2 === 'Especialista' ? (
              <>
               {perfilSelecionado === 'Especialista' ? (
               <div  className="nota center">
                
              </div>
              ) : (
                <>
                </>
                )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                <p>
                  Especialista é a pessoa que possui um vasto conhecimento e 
                  experiência em um determinado assunto, empacota todo esse 
                  conhecimento e transforma em um infoproduto, mentoria ou consultoria. 
                  E, com isso, busca impactar pessoas com seu conhecimento.
                  </p>
                </h5>
                
              </div>
              </>
              ) : (
              <>
              </>
             )}
           { perfilSelecionado2 === 'Gestor de Redes Sociais'  ? (
            <>
            {perfilSelecionado === 'Gestor de Redes Sociais' ? (
             <div  className="nota center">
                
              </div>
               ) : (
                <>
                </>
               )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                  <p>
                  O gestor de conteúdo, ou social media, é a pessoa responsável pela 
                  gestão das redes sociais de uma determinada pessoa. Quem atua nessa 
                  área costuma estar sempre antenado(a) em blogs e perfis de digitais 
                  influencers e acessa com frequência as redes sociais. 
                  </p>
                </h5>
              </div>
            </>
            
              ) : (
              <>
              </>
              )}
            { perfilSelecionado2 === 'Gestor de Tráfego' ? (
              <>
               {perfilSelecionado === 'Gestor de Tráfego' ? (
               <div  className="nota center">
                
             </div>
              ) : (
              <>
              </>
                )}
             <div style={{bordeRadius: 10}} className="nota center">
              <h5>
                <p>
                  O gestor de tráfego tem o objetivo de levar o maior número de pessoas (potenciais clientes) para uma oferta,
                  site, loja. Através de anúncios e campanhas que, geralmente,  são veiculados nas redes sociais. Quem atua nessa 
                  área costuma ser bom na análise de dados. 
                 </p>
              </h5>
                
              </div>
              </>
             
              ) : (
              <>
              </>
            )}

            { perfilSelecionado2 === 'Lançador ou Estrategista' ? (
              <>
               {perfilSelecionado === 'Lançador ou Estrategista' ? (
                <div className='nota center'>
                 
                </div>
                ) : (
                  <>
                 </>
                 )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                  <p>
                    O lançador ou estrategista, é a pessoa responsável por toda a parte
                    estratégica no lançamento de um infoproduto. Quem atua nessa área, 
                    costuma ser bom em gestão de pessoas e projetos, além de ter facilidade 
                    em criar processos e em resolver problemas. 
                  </p>
                </h5>
                
              </div>
              </>
              ) : (
              <>
              </>
            )}
<div  className="nota center">
            { perfilSelecionado2 === 'Designer ou Videomaker'  ? (
             
             <>
              {perfilSelecionado === 'Designer ou Videomaker' ? (
              <div  className="nota center">
                
              </div>
             
               ) : (
                <>
               </>
              )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                  <p>
                    Criação é a área em que designers e pessoas que trabalham 
                    com a parte de audiovisual atuam. Quem trabalha 
                    nessa área, geralmente, são pessoas que gostam ou tem interesse 
                    em captação e edição de fotos e vídeos.
                  </p>
                </h5>
              </div>
              </>
              ) : (
              <>
              </>
             )}
              </div>

            { perfilSelecionado2 === 'Webdesigner'  ? (
              <>
              {perfilSelecionado === 'Webdesigner' ? (
                <div  className="nota center">
                  
                </div>
                 ) : (
                  <>
                 </>
                )}
                <div style={{bordeRadius: 10}} className="nota center">
                  <h5>
                    <p>
                      O web designer é o profissional responsável pela criação e estruturação de sites. É um profissional com uma visão
                      criativa que busca as melhores soluções para deixar uma página, um blog, muito mais atrativo.   
                    </p>
                  </h5>
                  
               </div>
              </>
              
              ) : (
              <>
              </>
            )}
<br/>
            <h1 className="pergunta center profissao">PROFISSÃO TERCIÁRIO: </h1>
            <h1 className="pergunta center perfil " >{`${perfilSelecionado3}`}</h1>
            
            {  perfilSelecionado3 === 'Afiliado' ? (
              <>
               {perfilSelecionado === 'Afiliado' ? (
               <div  className="nota center">
                
              </div>
              ) :  (
                <>
                </>
              )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                  <p>
                    O afiliado é alguém que divulga produtos e serviços de outras pessoas na internet e, em troca dessa
                    indicação para outras pessoas, o afiliado recebe uma comissão por cada venda realizada.
                  </p>
                </h5>
                </div>
              </>
             
              ) : (
                <>
                </>
            )}
            {  perfilSelecionado3 === 'Copywriter' ? (
              <>
               {perfilSelecionado === 'Copywriter' ? (
              <div  className="nota center">
                  
               </div>
                 ) :  (
                  <>
                  </>
               )}
               <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                <p>
                    Copywriter é a pessoa que escreve textos persuasivos com o objetivo 
                    de despertar no leitor a tomada de uma ação, seja ela uma curtida, 
                    um email ou a própria venda. 
                  </p>
                </h5>
                  
                </div>
              </>
               
              ) : (
              <>
              </>
            )}
           
           { perfilSelecionado3 === 'e-commerce' ? (
            <>
            {perfilSelecionado === 'e-commerce' ? (
             <div  className="nota center">
            
              </div>
                ) :  (
                  <>
                  </>
                )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                <p>
                    O gestor / dono de e-Commerce é aquele perfil profissional responsável por um 
                    comércio eletrônico ou loja online de uma empresa, até mesmo sua própria. 
                    Essa pessoa teria como objetivo do e-Commerce elaborar estratégias de criação e de vendas para lojas online.
                  </p>
                </h5>
                  
                </div>
            </>
              ) : (
              <>
              </>
            )}
            {  perfilSelecionado3 === 'Especialista'? (
              <>
               {perfilSelecionado === 'Especialista' ? (
               <div  className="nota center">
                
              </div>
              ) : (
                <>
                </>
                )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                <p>
                  Especialista é a pessoa que possui um vasto conhecimento e 
                  experiência em um determinado assunto, empacota todo esse conhecimento e 
                  transforma em um infoproduto, mentoria ou consultoria. E, com isso, busca 
                  impactar pessoas com seu conhecimento.
                </p>
                </h5>
               
              </div>
              </>
              ) : (
              <>
              </>
             )}
           {  perfilSelecionado3 === 'Gestor de Redes Sociais' ? (
            <>
            {perfilSelecionado === 'Gestor de Redes Sociais' ? (
             <div  className="nota center">
                
              </div>
               ) : (
                <>
                </>
               )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                <p>
                O gestor de conteúdo, ou social media, é a pessoa responsável pela 
                gestão das redes sociais de uma determinada pessoa. Quem atua nessa 
                área costuma estar sempre antenado(a) em blogs e perfis de digitais 
                influencers e acessa com frequência as redes sociais. 
                </p>
                </h5>

                
              </div>
            </>
            
              ) : (
              <>
              </>
              )}
            {  perfilSelecionado3 === 'Gestor de Tráfego'? (
              <>
               {perfilSelecionado === 'Gestor de Tráfego' ? (
               <div  className="nota center">
                
             </div>
              ) : (
              <>
              </>
                )}
             <div style={{bordeRadius: 10}} className="nota center">
              <h5>
              <p>
                  O gestor de tráfego tem o objetivo de levar o maior número de pessoas (potenciais clientes) para uma oferta,
                  site, loja. Através de anúncios e campanhas que, geralmente,  são veiculados nas redes sociais. Quem atua nessa 
                  área costuma ser bom na análise de dados. 
                </p>
              </h5>
                
              </div>
              </>
             
              ) : (
              <>
              </>
            )}

            {  perfilSelecionado3 === 'Lançador ou Estrategista' ? (
              <>
               {perfilSelecionado === 'Lançador ou Estrategista' ? (
                <div className='nota center'>
                 
                </div>
                ) : (
                  <>
                 </>
                 )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                <p>
                O lançador ou estrategista, é a pessoa responsável por toda a parte
                 estratégica no lançamento de um infoproduto. Quem atua nessa área, 
                 costuma ser bom em gestão de pessoas e projetos, além de ter facilidade 
                 em criar processos e em resolver problemas. 
                 </p>
                </h5>
               
              </div>
              </>
              ) : (
              <>
              </>
            )}

            {  perfilSelecionado3 === 'Designer ou Videomaker' ? (
             
             <>
              {perfilSelecionado === 'Designer ou Videomaker' ? (
              <div  className="nota center">
                
              </div>
               ) : (
                <>
               </>
              )}
              <div style={{bordeRadius: 10}} className="nota center">
                <h5>
                  <p>Criação é a área em que designers e pessoas que trabalham com a parte de audiovisual atuam. Quem trabalha 
                    nessa área, geralmente, são pessoas que gostam ou tem interesse em captação e edição de fotos e vídeos.
                  </p>
                </h5>
              </div>
                
              </>
              ) : (
              <>
              </>
             )}

            {  perfilSelecionado3 === 'Webdesigner' ? (
              <>
              {perfilSelecionado === 'Webdesigner' ? (
                <div  className="nota center">
                  
                </div>
                 ) : (
                  <>
                  
                 </>
                )}
                <div style={{bordeRadius: 10}} className="nota center">
                  <h5>
                    <p>
                      O web designer é o profissional responsável pela criação e estruturação de sites. É um profissional com uma visão
                      criativa que busca as melhores soluções para deixar uma página, um blog, muito mais atrativo.   
                    </p>
                  </h5>
                
               </div>
              </>
              
              ) : (
              <>
              </>
            )}

            

            
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
