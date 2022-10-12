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

import '../../src/CaronasBrasil.css';

const Caronas = () => {

  const [isAluno, setIsAluno] = useState(true);
  const [estado, setEstado] = useState('');
  const [cidades, setCidades] = useState([]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [custo, setCusto] = useState('');
  const [cidade, setCidade] = useState('');

  const setDadosForm = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === 'nome') {
      setNome(value);
      return;
    }

    if (name === 'email') {
      setEmail(value);
      return;
    }

    if (name === 'whatsapp') {  
      setWhatsapp(value);
      return;
    }

    if (name === 'custo') {
      setCusto(value);
      return;
    }

    if (name === 'estado') {
      setEstado(value);
      return;
    }

    if (name === 'cidade') {
      setCidade(value);
      return;
    }
  }

  const cadastrarCarro = async (event) => {
    event.preventDefault();
    const dados = {
      nome,
      whatsapp,
      custo,
      estado,
      cidade,
      email
    };

    if (nome === '') {
      notifyError('O nome é obrigatório.');
      return;
    }

    if (whatsapp === '') {
      notifyError('O whatsapp é obrigatório.');
      return;
    }

    if (custo === '') {
      notifyError('O custo é obrigatório.');
      return;
    }

    if (estado === '') {
      notifyError('O estado é obrigatório.');
      return;
    }

    if (cidade === '') {
      notifyError('O cidade é obrigatório.');
      return;
    }

    if (email === '') {
      notifyError('O email é obrigatório.');
      return;
    }

    await api.post(`/caronas`, dados).then((res) => {
      window.location.replace("/caronas-tanques");
    });
  }

  const informarEstado = (event) => {
    const estadoSelecionado = event.target.value;
    setEstado(estadoSelecionado);
    exibirCidades(estadoSelecionado);
    setDadosForm(event);
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
    window.location.replace("https://plataformagame.com.br/caronas-tanques");
  }

  const abrirLinkCompra = () => {
    window.location.replace("https://pablomarcal.com.br/trabalhadores-ultima-hora");
  }

  const abrirCadastro = () => {
    setIsAluno(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const mask = (event) => {
    let numero = event.target.value;
    console.log(numero);
    setTimeout(() => {
        let v = mphone(numero);
        if (v != numero) {
          event.target.value = v;
        }
    }, 1);
  }
  
  const mphone = (v) => {
    var r = v.replace(/\D/g,"");
    r = r.replace(/^0/,"");
    if (r.length > 10) {
        // 11+ digits. Format as 5+4.
        r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/,"($1) $2-$3");
    }
    else if (r.length > 5) {
        // 6..10 digits. Format as 4+4
        r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/,"($1) $2-$3");
    }
    else if (r.length > 2) {
        // 3..5 digits. Add (0XX..)
        r = r.replace(/^(\d\d)(\d{0,5})/,"($1) $2");
    }
    else {
        // 0..2 digits. Just add (0XX
        r = r.replace(/^(\d*)/, "($1");
    }
    return r;
  }

  useEffect(() => {
    // getProva();
  }, []);

  return (
    <Container className="p-3">
      <div className="centerImg">
        <img src={"img/carona-brasil.png"} alt="Caronas Brasil" height="130"/>
      </div>
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#002247' }}>
          <h1 className="perguntaGeneral">
            Se seu carro tem vaga para alguns brasileiros votarem preencha as informações abaixo.
          </h1>
          <br />
          <h1 className="perguntaGeneral">
            Os eleitores entrarão em contato com você.
          </h1>
          <Form style={{ background: '#002247' }}>
            <fieldset>
              <Form.Group as={Row} className="mb-3">
                <Form.Control 
                  className="inputEmail"
                  type=""
                  placeholder="Seu nome"
                  name="nome"
                  onChange={setDadosForm}
                />
                <Form.Control 
                  className="inputEmail"
                  type=""
                  placeholder="Seu email"
                  name="email"
                  onChange={setDadosForm}
                />
                <Form.Control 
                  className="inputEmail"
                  type=""
                  placeholder="Seu Whatsapp com DDD"
                  name="whatsapp"
                  onChange={setDadosForm}
                  onKeyPress={mask}
                  onKeyUp={mask}
                  onBlur={mask}
                />
                <Form.Control 
                  className="inputEmail"
                  type="number"
                  placeholder="Quanto deseja cobrar por vaga?"
                  name="custo"
                  onChange={setDadosForm}
                />
                <select id="estado" name="estado" className="estados" onChange={informarEstado}>
                  <option value="">Selecione seu estado</option>
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

              <select id="cidade" name="cidade" className="estados" onChange={setDadosForm}>
                  <option value="">Selecione sua cidade</option>
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
                        background: '#00c354',
                        borderColor: '#00c354'
                      }}
                      onClick={cadastrarCarro}
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
        <Jumbotron className="painel" style={{ background: '#002247' }}>
          <h1 className="pergunta center tituloGenerais">
            VAMOS SALVAR O BRASIL JUNTOS? 
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            Agora é a hora, o seu voto não vai ficar para trás…
          </h1>
          <br/>
          <h1 className="perguntaGeneral center" style={{ fontWeight: 100 }}>
            O Carona Brasil conecta quem se dispõe a transbordar dando carona a quem precisa de carona para realizar seu voto!
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            Não podemos perder os nossos princípios e valores cristãos para o inimigo de 9 dedos.
          </h1>
          <br/>
          <br/>
          <h1 className="pergunta center tituloGenerais">
            O QUE É O CARONA BRASIL?
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            O Movimento Carona Brasil é um transbordo que você pode fazer e/ou receber em prol da nação.
          </h1>
          <br/>
          <h1 className="perguntaGeneral center" style={{ fontWeight: 100 }}>
            Estamos na reta final e o seu voto é a melhor arma para lutar pela sua família, por isso, nós não podemos deixar a energia baixar agora.
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            O voto é uma questão de sobrevivência para o próximo turno.
          </h1>
          <br/>
          <h1 className="perguntaGeneral center" style={{ fontWeight: 100 }}>
            Por saber que algumas pessoas não vão ter condições financeiras ou de locomoção, nós criamos isso para facilitar a ida dessas pessoas para suas respectivas cidades votarem.
          </h1>
          <br/>
          <div className="center">
            <Form.Group as={Row} className="mb-3" style={{ width: '100%' }}>
              <Button
                type="submit"
                className="btnEnviarRespostas"
                onClick={abrirCadastro}
                style={{ 
                  background: '#00c354',
                  borderColor: '#00c354',
                  width: '100%'
                }}
              >
                TENHO CARRO E QUERO DAR CARONA
              </Button>
              <ToastContainer />
            </Form.Group>
          </div>
          <h1 className="perguntaGeneral center">
            OU
          </h1>
          <div className="center">
            <Form.Group as={Row} className="mb-3" style={{ width: '100%' }}>
              <Button
                type="submit"
                className="btnEnviarRespostas"
                onClick={abrirLink}
                style={{ 
                  background: '#00c354',
                  borderColor: '#00c354',
                  width: '100%'
                }}
              >
                PRECISO DE CARONA
              </Button>
              <ToastContainer />
            </Form.Group>
          </div>
        </Jumbotron>
      )}
      <h1 className="pergunta center" style={{ fontWeight: 100, margin: '15px', fontSize: '15px' }}>
        Atenção: Essa página tem como objetivo facilitar o acesso aos locais de votação. 
        Não nos responsabilizamos por nada que for combinado entre os participantes.
      </h1>
    </Container>
  );
};

export default Caronas;
