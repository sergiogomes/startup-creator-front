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

import '../../src/RotaDigital.css';

const Caronas = () => {

  const [prova, setProva] = useState('');
  const [isAluno, setIsAluno] = useState(true);
  const [aluno, setAluno] = useState({});
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
      console.log(res);
      window.location.href = '/caronas-tanques';
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
    window.open("http://plataformagame.com.br/caronas-tanques");
  }

  const abrirLinkCompra = () => {
    window.open("https://www.eventx.com.br/ochamadoaconvocacaodosgenerais");
  }

  const abrirCadastro = () => {
    setIsAluno(false);
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
        <img src={"img/logo-caronas.png"} alt="O Chamado 2022" height="130"/>
      </div>
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="perguntaGeneral">
            Se seu carro tem vaga para alguns Generais
            Preencha as informações abaixo.
          </h1>
          <br />
          <h1 className="perguntaGeneral">
            Os Generais disponíveis entrarão em contato com você.
          </h1>
          <Form style={{ background: '#1a1a1a' }}>
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
                        background: '#76793F',
                        borderColor: '#76793F'
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
        <Jumbotron className="painel" style={{ background: '#1a1a1a' }}>
          <h1 className="pergunta center tituloGenerais">
            Convocação dos Generais 
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            Encontre sua carona para “O Chamado”
            29 de dezembro - Goiânia
          </h1>
          <br/>
          <h1 className="perguntaGeneral center" style={{ fontWeight: 100 }}>
            Abaixo você tem duas opções: Dar carona para algum general,
            ou encontrar um batalhão que possa te levar ao evento. 
          </h1>
          <br/>
          <h1 className="perguntaGeneral center">
            Clique no botão abaixo e bora tocar o terror!
          </h1>
          <br/>
          <div className="center">
            <Form.Group as={Row} className="mb-3" style={{ width: '100%' }}>
              <Button
                type="submit"
                className="btnEnviarRespostas"
                onClick={abrirCadastro}
                style={{ 
                  background: '#76793F',
                  borderColor: '#76793F',
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
                  background: '#76793F',
                  borderColor: '#76793F',
                  width: '100%'
                }}
              >
                PRECISO DE CARONA
              </Button>
              <ToastContainer />
            </Form.Group>
          </div>
          <div className="center">
            <Form.Group as={Row} className="mb-3" style={{ width: '100%', paddingTop: '8px' }}>
              <Button
                type="submit"
                className="btnEnviarRespostas"
                onClick={abrirLinkCompra}
                style={{ 
                  background: '#cd0000',
                  borderColor: '#cd0000',
                  width: '100%'
                }}
              >
                NÃO TENHO INGRESSO, <br/>QUERO ADQUIRIR!
              </Button>
              <ToastContainer />
            </Form.Group>
          </div>
        </Jumbotron>
      )}
      <h1 className="pergunta center" style={{ fontWeight: 100, margin: '15px', fontSize: '15px' }}>
        Atenção: Essa página tem como objetivo facilitar o acesso de todos ao evento. 
        Não nos responsabilizamos por nada que for combinado entre os participantes.
      </h1>
      <div className="centerImg">
        <img className="logoRotaDigital" src={"img/pablo1.png"} alt="Pablo Marçal"/>
      </div>
    </Container>
  );
};

export default Caronas;
