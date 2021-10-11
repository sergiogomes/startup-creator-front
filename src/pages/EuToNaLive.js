import { React, useEffect, useState } from 'react';

import Lottie from 'react-lottie';
import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

import * as EmailValidator from 'email-validator';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toasts';

import api from '../services/api';

import animationData from '../lottie/check.json';

import '../../src/App.css';

const EuToNaLive = () => {

  const [emailAluno, setEmailAluno] = useState('');
  const [isAluno, setIsAluno] = useState(false);
  const [aluno, setAluno] = useState({});

  const salvarEmailAluno  = async (event) => {
    try {
      const email = event.target.value;

      setEmailAluno({...emailAluno, email});
    } catch (error) {
      console.log(error);
    }
  };

  const validarEmail  = async (event) => {
    try {
      event.preventDefault();
      if (!EmailValidator.validate(emailAluno.email)) {
        notifyError('Informe o seu email.');
        return;
      }

      await api.post(`/email/validar`, emailAluno).then((res) => {
        const { participante } = res.data;
        setAluno(participante);
        setIsAluno(true);
      });
    } catch (error) {
      notifyError('O email apresentado não faz parte da nossa base de alunos.');
      console.log(error);
      setIsAluno(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    const analytics = Analytics({
      app: 'prova-cdr-123',
      plugins: [
        googleAnalytics({
          trackingId: 'G-P3DRTL8QKN'
        })
      ]
    })
    analytics.page()
  }, []);

  return (
    <Container className="p-3" style={{ background: '#000' }}>
      <div className="centerImg">
        <img src={"img/CDR600x300.png"} alt="A Ciência da Riqueza" height="75"/>
      </div>
      {!isAluno ? (
        <Jumbotron className="painel" style={{ background: '#8c6531' }}>
          <h1 className="pergunta">Informe o email cadastrado no curso:</h1>
          <Form style={{ background: '#8c6531' }}>
            <fieldset>
              <Form.Group as={Row} className="mb-3">
                <Form.Control 
                  className="inputEmail"
                  type="email"
                  placeholder="Digite aqui..."
                  onChange={salvarEmailAluno}
                />
              </Form.Group>
              <div className="center">
                  <Form.Group as={Row} className="mb-3">
                    <Button type="submit" className="btnEnviarRespostas" onClick={validarEmail}>PRESENTE</Button>
                    <ToastContainer />
                  </Form.Group>
                </div>
            </fieldset>
          </Form>
        </Jumbotron>
      ) : (
        <>
          <Jumbotron className="painel" style={{ background: '#8c6531' }}>
            <h1 className="pergunta center">Presença na live confirmada!</h1>
            <h1 className="pergunta center">Valeu seu Rico e sua Rica.</h1>
            <Form style={{ background: '#8c6531' }}>
              <fieldset>
                <Form.Group as={Row} className="mb-3">
                <Lottie
                  options={defaultOptions}
                  height={400}
                  width={400}
                  isStopped={false}
                  isPaused={false}
                />
                </Form.Group>
              </fieldset>
            </Form>
          </Jumbotron>
        </>
      )}
      <div className="centerImg">
        <img className="logoPablo" src={"img/pablo1.png"} alt="A Ciência da Riqueza"/>
      </div>
    </Container>
  );
};

export default EuToNaLive;
