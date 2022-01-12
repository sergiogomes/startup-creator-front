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
  const [ruben, setRuben] = useState(0);
  const [simeao, setSimeao] = useState(0);
  const [levi, setLevi] = useState(0);
  const [juda, setJuda] = useState(0);
  const [da, setDa] = useState(0);
  const [naftali, setNaftali] = useState(0);
  const [gade, setGade] = useState(0);
  const [aser, setAser] = useState(0);
  const [issacar, setIssacar] = useState(0);
  const [zebulom, setZebulom] = useState(0);
  const [jose, setJose] = useState(0);
  const [benjamim, setBenjamim] = useState(0);
  const [perfilSelecionado, setPerfilSelecionado] = useState('Carregando...');
  const [paginas, setPaginas] = useState([226, 227, 228, 229, 230]);
  const [perguntaAtual, setPerguntaAtual] = useState(226);

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova/17`);
      const { perguntas, respostas, prova } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
      setProva(prova);
      exibirPergunta(226);
    } catch (error) {
      console.log(error);
      notifyError('Neste momento não tem prova disponivel! Fique atendo nas lives de terça!');
    }
  };

  const salvarResposta = async (event) => {
    try {
      const certa = event.target.getAttribute('certa');
      const opcao = certa.split(',');

      console.log('certa ->', certa.split(','));

      opcao.map((op) => {
        somarPontos(op);
      });

      if (opcao === 'A') {
        setExpert(expert + 1);
      }

      exibirProximaPergunta();
      setPerfilSelecionado(getPerfil());
    } catch (error) {
      console.log(error);
    }
  };

  const somarPontos = (opcao) => {
    console.log('somarPontos', opcao);

    if (opcao === '1') {
      setRuben(ruben + 3);
    }

    if (opcao === '2') {
      setSimeao(simeao + 3);
    }

    if (opcao === '3') {
      setLevi(levi + 3);
    }

    if (opcao === '4') {
      setJuda(juda + 3);
    }

    if (opcao === '5') {
      setDa(da + 3);
    }

    if (opcao === '6') {
      setNaftali(naftali + 3);
    }

    if (opcao === '7') {
      setGade(gade + 3);
    }

    if (opcao === '8') {
      setAser(aser + 3);
    }

    if (opcao === '9') {
      setIssacar(issacar + 3);
    }

    if (opcao === '10') {
      setZebulom(zebulom + 3);
    }

    if (opcao === '11') {
      setJose(jose + 3);
    }

    if (opcao === '12') {
      setBenjamim(benjamim + 3);
    }
  }

  const exibirProximaPergunta = () => {
    if (perguntaAtual === 230) {
      enviarResposta();
      return;
    }

    if (perguntaAtual === 0) {
      exibirPergunta(226);
      setPerguntaAtual(226);
      return;
    }

    if (perguntaAtual >= 226) {
      exibirPergunta(perguntaAtual + 1);
      setPerguntaAtual(perguntaAtual + 1);
      esconderPergunta(perguntaAtual);
      return;
    }
  }

  const exibirPergunta = (id) => {
    document.getElementById(`pergunta-${id}`).style.display = 'block';
  }

  const esconderPergunta = (id) => {
    document.getElementById(`pergunta-${id}`).style.display = 'none';
  }

  const getPerfil = () => {
    const maiorValor = Math.max(...[ruben, simeao, levi, juda, da, naftali, gade, aser, issacar, zebulom, jose, benjamim]);

    if (ruben > 0 && ruben === maiorValor) {
      return 'RÚBEN';
    }

    if (simeao > 0 && simeao === maiorValor) {
      return 'SIMEÃO';
    }

    if (levi > 0 && levi === maiorValor) {
      return 'LEVI';
    }

    if (juda > 0 && juda === maiorValor) {
      return 'JUDÁ';
    }

    if (da > 0 && da === maiorValor) {
      return 'DÃ';
    }

    if (naftali > 0 && naftali === maiorValor) {
      return 'NAFTALI';
    }

    if (gade > 0 && gade === maiorValor) {
      return 'GADE';
    }

    if (aser > 0 && aser === maiorValor) {
      return 'ASER';
    }

    if (issacar > 0 && issacar === maiorValor) {
      return 'ISSACAR';
    }

    if (zebulom > 0 && zebulom === maiorValor) {
      return 'ZEBULOM';
    }

    if (jose > 0 && jose === maiorValor) {
      return 'JOSÉ';
    }

    if (benjamim > 0 && benjamim === maiorValor) {
      return 'BENJAMIM';
    }

    return false;
  }

  const enviarResposta = async (event) => {
    try {
      if((perguntaAtual) <= 229) {
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

  const abrirLink = () => {
    window.open("https://devzap.com.br/api-engennier/campanha/api/redirectlink/61de1ab28441500001467bd9");
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
        <img src={"img/12tribos.png"} alt="12 Tribos" height="120"/>
      </div>
      {isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
        </Jumbotron>
      ) : (
        <>
        {!isProvaRespondida ? (
          <>
            <h1 className="nota center">DESCUBRA QUAL É A SUA TRIBO</h1>
          {perguntas.map((pergunta, i) => {
            return (
              <>
                <Jumbotron className="painel" id={`pergunta-${pergunta.id}`} style={{ background: '#1a1a1a', display: 'none', padding: '15px' }}>
                  <Form style={{ background: '#1a1a1a' }} onSubmit={handleSubmit}>
                  <h1 className="pergunta" key={i}>{`${i + 1}) ${pergunta.pergunta}`}</h1>
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
                                certa={`${resposta.certa}`}
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
              <h1 className="pergunta center tituloResultado">SUA TRIBO É: </h1>
              {/* <h1 className="pergunta center perfil">{`${perfilSelecionado}`}</h1> */}

              {perfilSelecionado === 'RÚBEN' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/ruben.png"} alt="Tribo Rúben"/>
                  </div>
                  <h1 className="nota center">Símbolo: Sol e Água</h1>
                  <h1 className="notaTribo center">Função: Pecuária – tribo responsável pela criação de animais, pastoreio etc.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'SIMEÃO' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/simeao.png"} alt="Tribo Simeão"/>
                  </div>
                  <h1 className="nota center">Símbolo: Fortaleza e Torre</h1>
                  <h1 className="notaTribo center">Função: Militar – tribo responsável pela segurança das tribos, formada por soldados de guerra.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'LEVI' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/levi.png"} alt="Tribo Levi"/>
                  </div>
                  <h1 className="nota center">Símbolo: Peitoral das vestes do sumo sacerdote</h1>
                  <h1 className="notaTribo center">Função: espiritual – Tribo formada por líderes espirituais, responsáveis em ensinar e receber os sacrifícios e ofertas do povo.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'JUDÁ' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/juda.png"} alt="Tribo Judá"/>
                  </div>
                  <h1 className="nota center">Símbolo: Leão</h1>
                  <h1 className="notaTribo center">Função: Governar e promover o bem estar do povo – tribo responsável pela saúde do povo, formada por médicos, enfermeiros, terapeutas e também por líderes políticos. Pertencem à tribo Judá o Rei Davi e o Senhor Jesus.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'DÃ' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/da.png"} alt="Tribo Dã"/>
                  </div>
                  <h1 className="nota center">Símbolo: Serpente</h1>
                  <h1 className="notaTribo center">Função: Direito – tribo formada por juízes que decidiam as causas de todo o povo.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'NAFTALI' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/naftali.png"} alt="Tribo Naftali"/>
                  </div>
                  <h1 className="nota center">Símbolo: Gazela</h1>
                  <h1 className="notaTribo center">Função: Comunicador e responsável pelo meio ambiente – eram eloquentes, escritores e porta-vozes do povo, além de cuidarem da natureza.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'GADE' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/gade.png"} alt="Tribo Gade"/>
                  </div>
                  <h1 className="nota center">Símbolo: Tenda</h1>
                  <h1 className="notaTribo center">Função: Responsáveis pelo acampamento – tribo encarregada de montar e desmontar o acampamento a cada mudança.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'ASER' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/aser.png"} alt="Tribo Aser"/>
                  </div>
                  <h1 className="nota center">Símbolo: Árvore Frutífera</h1>
                  <h1 className="notaTribo center">Função: Abastecimento – responsável pelo armazenamento de alimentos para todas as tribos.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'ISSACAR' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/issacar.png"} alt="Tribo Issacar"/>
                  </div>
                  <h1 className="nota center">Símbolo: Jumento</h1>
                  <h1 className="notaTribo center">Função: Transporte – responsáveis pela travessia dos bens das tribos em suas peregrinações. Criavam jumentos, animais fortes e resistentes que atravessavam até desertos com grandes cargas.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'ZEBULOM' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/zebulom.png"} alt="Tribo Zebulom"/>
                  </div>
                  <h1 className="nota center">Símbolo: Navio</h1>
                  <h1 className="notaTribo center">Função: Comércio marítimo – negociação de mercadorias com outras nações. O princípio do comércio exterior de Israel.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'JOSÉ' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/jose.png"} alt="Tribo José"/>
                  </div>
                  <h1 className="nota center">Símbolo: Trigo</h1>
                  <h1 className="notaTribo center">Função: Liderança e negociação – a tribo de José foi dividida em duas: Manassés e Efraim, seus filhos. José foi próspero na terra de suas aflições e garantiu a sobrevivência de seu povo.</h1>
                </>
              ) : (
                <></>
              )}

              {perfilSelecionado === 'BENJAMIM' ? (
                <>
                  <div className="centerImg">
                    <img className="logoTribo" src={"img/tribos/benjamim.png"} alt="Tribo Benjamim"/>
                  </div>
                  <h1 className="nota center">Símbolo: Lobo</h1>
                  <h1 className="notaTribo center">Função: Caça – tribo responsável pela caça, composta de homens valentes que também eram grandes soldados de guerra.</h1>
                </>
              ) : (
                <></>
              )}
              
              <br />
              <p className="nota center">
                  <strong style={{ fontSize: '14px' }}>
                    Entre no grupo do Whatsapp para descobrir como encontrar a sua tribo.
                  </strong>
              </p>
              <div className="center">
                <Form.Group as={Row} className="mb-3">
                  <Button className="btnEnviarRespostasWhats" onClick={abrirLink}>
                    <img className="logoBotaoWhats" src={"img/whatsapp-branco.png"} />
                    &nbsp;QUERO ENCONTRAR MINHA TRIBO
                  </Button>
                  <ToastContainer />
                </Form.Group>
              </div>
              
              {/* <h1 className="pergunta center">Grupo Fechado e Silencioso</h1> */}
            </div>

          </Jumbotron>
        )}
        </>
      )}
      <div className="centerImg">
        <img className="logoPablo" src={"img/pablo1.png"} alt="Pablo Marçal"/>
      </div>
      <Helmet>
        <script>
          {`
            if (document.location.pathname.indexOf("/teste-12-tribos") == 0) {
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

export default Dashboard;
