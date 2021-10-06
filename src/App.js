import { React, useEffect, useState } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import api from './services/api';

import './App.css';

const Dashboard = () => {

  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [respostaAluno, setRespostaAluno] = useState([]);
  const [emailAluno, setEmailAluno] = useState('');

  const getProva = async () => {
    try {
      const { data } = await api.get(`/prova`);
      const { perguntas, respostas } = data.provaAtual;
      setPerguntas(perguntas);
      setRespostas(respostas);
    } catch (error) {
      console.log(error);
      // notifyError('Algo deu errado ao buscar o número de clientes cadastrados');
    }
  };

  const salvarResposta = async (event) => {
    try {
      const resposta = {
        perguntaId : event.target.name,
        respostaId : event.target.value 
      };

      console.log();

      setRespostaAluno(respostaAluno => [...respostaAluno, resposta]);


      // teste para reduzir o tamanho das respostas
      var invalidEntries = 0;
      function filtrarRespotas(obj) {
        if (
          'perguntaId' in obj && 
          typeof(obj.perguntaId) === 'string' && 
          !isNaN(obj.perguntaId) &&
          obj.perguntaId === '3'
        ) {
          return true;
        } else {
          invalidEntries++;
          return false;
        }
      }

      var arrByID = respostaAluno.filter(filtrarRespotas);

      console.log('Filtered Array\n', arrByID);
      console.log('Number of Invalid Entries = ', invalidEntries);
      // fim do teste

    } catch (error) {
      console.log(error);
    }
  };

  const salvarEmailAluno  = async (event) => {
    try {
      console.log('salvarEmailAluno', event.target.name, event.target.value);
      const email = event.target.value;

      setEmailAluno({...emailAluno, email});
    } catch (error) {
      console.log(error);
    }
  };

  const enviarResposta = async () => {
    try {
      const objeto = {
        respostas : respostaAluno,
        provas_id : perguntas[0].provas_id,
        email: emailAluno.email
      }

      console.log('-- respostaAluno -->', objeto);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('handlesubmit ', event.target);
  }

  useEffect(() => {
    getProva();
  }, []);

  return (
    <Container className="p-3" style={{ background: '#000' }}>
      <div className="centerImg">
        <img src={"img/CDR600x300.png"} alt="A Ciência da Riqueza" height="75"/>
      </div>
      <h1 className="nota center">Âncoras são marcas que fazem seu cérebro 
  se comportar do jeito que você quer.</h1>
        {perguntas.map((pergunta, i) => {
           return (
            <>
              <Jumbotron className="painel" style={{ background: '#8c6531' }}>
                <Form style={{ background: '#8c6531' }} onSubmit={handleSubmit}>
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
                              label={`${resposta.resposta}`}
                              onChange={salvarResposta}
                              name={`${pergunta.id}`}
                              value={`${resposta.id}`}
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
      <Jumbotron className="painel" style={{ background: '#8c6531' }}>
        <h1 className="pergunta">Informe o email cadastrado no curso:</h1>
        <Form style={{ background: '#8c6531' }}>
          <fieldset>
            <Form.Group as={Row} className="mb-3">
              <Form.Control 
                className="inputEmail"
                type="email"
                placeholder="Email"
                onChange={salvarEmailAluno}
              />
            </Form.Group>
          </fieldset>
        </Form>
      </Jumbotron>
      <div className="center">
        <Form.Group as={Row} className="mb-3">
          <Button type="submit" className="btnEnviarRespostas" onClick={enviarResposta}>ENVIAR&nbsp;RESPOSTAS</Button>
        </Form.Group>
      </div>
      <h1 className="nota center">Lembre-se: isso é só a sombra do que há de vir. #TMJADF</h1>
      <div className="centerImg">
        <img className="logoPablo" src={"img/pablo1.png"} alt="A Ciência da Riqueza"/>
      </div>
    </Container>
  );
};

export default Dashboard;
