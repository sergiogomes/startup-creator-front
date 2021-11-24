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
      // background: "linear-gradient(to right, #019CAD, #4880EC)",
      background: "-webkit-gradient(linear, left top, left bottom, from(#019CAD), to(#4880EC)) fixed",
      width: '100%',
      backgroundAttachment: 'fixed',
      maxWidth: 'none',
      backgroundRepeat: 'no-repeat',
      minHeight: '720px'
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
              <h1 className="pergunta tituloResultado">{`${perfilSelecionado}`}</h1>

              {perfilSelecionado === 'Seu 2022 está no caminho para ser um dos melhores anos.' ? (
                <>
                <br />
                <p className="pergunta">
                  Parabéns! De acordo com seu teste, você tem tido um ano com bons resultados. Provavelmente você tem conseguido fazer as coisas acontecerem, a pergunta que fica é que se isso tem matado a sua qualidade de vida.
                </p>
                <p className="pergunta">
                  Não adianta ter resultados sem equilíbrio. Suas decisões precisam estar alinhadas com essas duas ideias em mente. Você pode escolher ter mais tempo, sabendo decidir que atividades executar, que atividades recusar, que atividades delegar. E mesmo quando você acha que não está tomando decisão nenhuma, você está escolhendo entregar a decisão na mão das circunstâncias. Algo como “deixa a vida me levar”. Só não vale reclamar depois e dizer que você não queria isso. Você pode escolher ter mais vida, se optar por fazer coisas importantes para você, aproveitar seus relacionamentos, fazer esporte, se dedicar a você.
                </p>
                <p className="pergunta">
                  Um ano só é completo com equilíbrio na sua rotina. E se você está conseguindo tempo para isso, parabéns. Caso contrário é sempre tempo de reavaliar a sua forma de planejar e como a sua produtividade pode aumentar.
                </p>
                <p className="pergunta">
                  <strong>Venha aprender mais técnicas para fazer um planejamento anual eficiente com equilíbrio na sua produtividade.</strong> Na semana de 6/12 teremos o workshop gratuito do O Melhor Ano de Todos, que vai ter aulas para ajudar você a estruturar seu plano, seus indicadores, seus sistemas e usar tempo com mais produtividade.
                </p>

                <p className="pergunta">
                  <strong>Para ser avisado, clique no botão abaixo para entrar no grupo do Whatsapp e não perder nenhum aviso das aulas.</strong>
                </p>
                </>
              ) : (<></>)
              }

              {perfilSelecionado === 'Você pode fazer 2022 ser ainda melhor.' ? (
                <>
                <br />
                <p className="pergunta">
                  Os planos parecem que não estão saindo do lugar para você. 
                  Talvez o ano atual tenha sido de muito esforço com pouco resultado e isso precisa mudar.
                </p>
                <p className="pergunta">
                  O que está impedindo você de criar um ano melhor é a falta de clareza do que realmente é importante para você, 
                  a alocação do seu tempo nesse rumo e a criação de metas que ajudem você a evoluir na direção das coisas realmente importantes da vida.
                </p>
                <p className="pergunta">
                  Os planos acabam não saindo do papel, porque provavelmente você não tem dedicado tempo suficiente ao planejamento e sua execução. Quando falamos de planejar, 
                  não significa que é algo escrito e que não vai ser alterado, muito pelo contrário. Fazer um planejamento anual do jeito correto ajuda você a ter mais clareza para o ano, 
                  ajuda você a definir as prioridades quando surgem oportunidades que não vão agregar, 
                  dizer não as coisas que não fazem sentido e ajustar a rota quando necessário.
                </p>
                <p className="pergunta">
                  Planejar aumenta as chances de as coisas darem certo,
                  pois coloca a sua mente focada naquilo que você quer, afasta das dúvidas e diminui a incerteza.
                </p>

                <p className="pergunta">
                  O que você precisa fazer imediatamente para ter um ano mais favorável:
                </p>

                <ul className="pergunta pontos">
                  <li>Aumentar seu autoconhecimento, entendendo seus pontos fortes e seus pontos fracos</li>
                  <li>Escrever as coisas que precisa obter para os próximos 90 dias e depois selecionar apenas 1 que seja factível de ser feita nesse período, criar uma lista de tarefas e colocar na sua agenda algo relacionado a esses itens todo dia.</li>
                  <li>Coloque seu foco em desenvolver mais as suas habilidades, em aprender coisas novas que possam ser colocadas em praticamente imediatamente e que tenham relação com seus objetivos.</li>
                  <li>Aprender a planejar seu tempo da forma correta. Troque o planejamento diário por um planejamento de três dias ou a semana toda. Antecipação é a chave do equilíbrio.</li>
                </ul>

                <p className="pergunta">
                  <strong>Você precisa urgentemente criar um plano para 2022.</strong> Na semana de 6/12 teremos o workshop gratuito do O Melhor Ano de Todos, que vai ter aulas para ajudar você a estruturar seu plano, seus indicadores, seus sistemas e usar tempo com mais produtividade.
                </p>

                <p className="pergunta">
                  <strong>Para ser avisado, clique no botão abaixo para entrar no grupo do Whatsapp e não perder nenhum aviso das aulas.</strong>
                </p>
                </>
              ) : (<></>)
              }

              {perfilSelecionado === 'Você precisa urgentemente criar um 2022 melhor.' ? (
                <>
                <br />
                <p className="pergunta">
                  Os planos parecem que não estão saindo do lugar para você. Talvez o ano atual tenha sido de muito esforço com pouco resultado e isso precisa mudar.
                </p>
                <p className="pergunta">
                  O que está impedindo você de criar um ano melhor é a falta de clareza do que realmente é importante para você, a alocação do seu tempo nesse rumo e a criação de metas que ajudem você a evoluir na direção das coisas realmente importantes da vida.
                </p>
                <p className="pergunta">
                  Os planos acabam não saindo do papel, porque provavelmente você não tem dedicado tempo suficiente ao planejamento e sua execução. Quando falamos de planejar, não significa que é algo escrito e que não vai ser alterado, muito pelo contrário. Fazer um planejamento anual do jeito correto ajuda você a ter mais clareza para o ano, ajuda você a definir as prioridades quando surgem oportunidades que não vão agregar, dizer não as coisas que não fazem sentido e ajustar a rota quando necessário.
                </p>
                <p className="pergunta">
                  Planejar aumenta as chances de as coisas darem certo, pois coloca a sua mente focada naquilo que você quer, afasta das dúvidas e diminui a incerteza.
                </p>

                <p className="pergunta">
                  O que você precisa fazer imediatamente para ter um ano mais favorável:
                </p>

                <ul className="pergunta pontos">
                  <li>Aumentar seu autoconhecimento, entendendo seus pontos fortes e seus pontos fracos</li>
                  <li>Escrever as coisas que precisa obter para os próximos 90 dias e depois selecionar apenas 1 que seja factível de ser feita nesse período, criar uma lista de tarefas e colocar na sua agenda algo relacionado a esses itens todo dia.</li>
                  <li>Coloque seu foco em desenvolver mais as suas habilidades, em aprender coisas novas que possam ser colocadas em praticamente imediatamente e que tenham relação com seus objetivos.</li>
                  <li>Aprender a planejar seu tempo da forma correta. Troque o planejamento diário por um planejamento de três dias ou a semana toda. Antecipação é a chave do equilíbrio.</li>
                </ul>

                <p className="pergunta">
                  <strong>Você precisa urgentemente criar um plano para 2022.</strong> Na semana de 6/12 teremos o workshop gratuito do O Melhor Ano de Todos, que vai ter aulas para ajudar você a estruturar seu plano, seus indicadores, seus sistemas e usar tempo com mais produtividade.
                </p>

                <p className="pergunta">
                  <strong>Para ser avisado, clique no botão abaixo para entrar no grupo do Whatsapp e não perder nenhum aviso das aulas.</strong>
                </p>
                </>
              ) : (<></>)
              }

              <div className="center">
                <Form.Group as={Row} className="mb-3">
                  <Button className="btnEnviarRespostasWhats" onClick={abrirLink}>
                    <img className="logoBotaoWhats" src={"img/whatsapp-branco.png"} />
                    &nbsp;QUERO ENTRAR NO GRUPO
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
        <img className="logoRotaDigital" src={"img/logo-christian-barbosa.png"} alt="Christian Barbosa" />
      </div>
      <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-413413781"></script>
        <script>
          {`
            if (document.location.pathname.indexOf("/teste-christian-barbosa") == 0) {
              console.log('teste-christian-barbosa');
        
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1156502128048829');
              fbq('track', 'PageView');
              fbq('track', 'Lead');
        
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
        
              gtag('config', 'AW-413413781');
              gtag('event', 'conversion', {'send_to': 'AW-413413781/0mPjCPDTs4IDEJXjkMUB'});
            }
          `}
        </script>
      </Helmet>
      <noscript>
        <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=1156502128048829&ev=PageView&noscript=1"
        />
      </noscript>
    </Container>
  );
};

export default ChristianBarbosa;
