import { React, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';

import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toasts';

import api from '../services/api';

import EstadosCidades from './cidades.json';

import '../../src/CaronasBrasil.css';

const CaronaPhone = () => {

  const [isAluno, setIsAluno] = useState(true);
  const [estado, setEstado] = useState('');
  const [estado2, setEstado2] = useState('');
  const [cidades, setCidades] = useState([]);
  const [cidades2, setCidades2] = useState([]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [custo, setCusto] = useState('');
  const [cidade, setCidade] = useState('');
  const [cidade2, setCidade2] = useState('');

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

    if (name === 'estado2') {
      setEstado2(value);
      return;
    }

    if (name === 'cidade2') {
      setCidade2(value);
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
      estado2,
      cidade2,
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
      window.location.replace("/pesquisacarona");
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

  const informarEstado2 = (event) => {
    const estadoSelecionado = event.target.value;
    setEstado2(estadoSelecionado);
    exibirCidades2(estadoSelecionado);
    setDadosForm(event);
  }

  const exibirCidades2 = async (estadoSelecionado) => {
    const { estados } = EstadosCidades;
    estados.map((estado) => {
      if (estado.sigla === estadoSelecionado) {
        setCidades2(estado.cidades);
      }
    })
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
        <Link to="/q" onClick={() => setIsAluno(true)}>
          <img src={"img/logophone.png"} alt="Carona Phone" width="280"/>
        </Link>
      </div>
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#002247' }}>
          <h1 className="perguntaGeneral">
            Se seu carro tem vaga para participante do evento preencha as informações abaixo.
          </h1>
          <br />
          <h1 className="perguntaGeneral">
            Os participantes do evento entrarão em contato com você.
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

                <Form.Label className="perguntaGeneral" style={{ paddingLeft: '15px' }}>Minha localização</Form.Label>
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
                      className="btnEnviarRespostas2"
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
            Carona Phone 
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            Vamos juntos pra Convenção Brazil Móbile ?
          </h1>
          <br/>
          <h1 className="perguntaGeneral center" style={{ fontWeight: 100 }}>
            Não tem desculpas que vão te impedir de vir para a primeira, única e maior Convenção do Mercado de smartphones. 
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            Nós queremos você aqui e vamos te ajudar!
          </h1>
          <br/>
          <br/>
          <h1 className="pergunta center tituloGenerais">
            O que é o Carona Phone ? 
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            O movimento carona Phone é um programa que vai conectar quem quer dar carona e quem precisa de carona para a Convenção!
          </h1>
          <br/>
          <h1 className="perguntaGeneral center" style={{ fontWeight: 100 }}>
            Resumindo…
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            vocês poderão rachar gasolina, gastar bem menos pra vir para a convenção e ainda fazer networking no meio do caminho. Clique em um dos dois botões abaixo e participe.
          </h1>
          <br/>
          <h1 className="perguntaGeneral center" style={{ fontWeight: 100 }}>
            Te esperamos no dia 20 de maio na Convenção Brazil Mobile.
          </h1>
          <br/>
          <div className="center">
            <Form.Group as={Row} className="mb-3" style={{ width: '100%' }}>
              <Button
                type="submit"
                className="btnEnviarRespostas2"
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
              <Link
                to="/pesquisacarona"
                className="btnEnviarRespostas"
                style={{ 
                  background: '#00c354',
                  borderColor: '#00c354',
                  width: '100%'
                }}
              >
                PRECISO DE CARONA
              </Link>
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

export default CaronaPhone;
