import React from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import './App.css';

const App = () => (
  <Container className="p-3" style={{ background: '#000' }}>
    <div className="centerImg">
      <img src={"img/CDR600x300.png"} alt="A Ciência da Riqueza" height="75"/>
    </div>
    <h1 className="nota center">Âncoras são marcas que fazem seu cérebro 
se comportar do jeito que você quer.</h1>
    <Jumbotron className="painel" style={{ background: '#8c6531' }}>
      <h1 className="pergunta">1) Escolha a âncora que está incorreta:</h1>
      <Form style={{ background: '#8c6531' }}>
        <fieldset className="alternativasRadius">
          <Form.Group as={Row} className="mb-3">
            <Col sm={10}>
              <Form.Check
                style={{ color: '#fff' }}
                type="radio"
                label="resposta&nbsp;1"
                name="formHorizontalRadios"
                id="formHorizontalRadios1"
                className="alternativa"
              />
              <Form.Check
                style={{ color: '#fff' }}
                type="radio"
                label="resposta&nbsp;2"
                name="formHorizontalRadios"
                id="formHorizontalRadios2"
                className="alternativa"
              />
              <Form.Check
                style={{ color: '#fff' }}
                type="radio"
                label="resposta&nbsp;3"
                name="formHorizontalRadios"
                id="formHorizontalRadios3"
                className="alternativa"
              />
            </Col>
          </Form.Group>
        </fieldset>
      </Form>
    </Jumbotron>
    <Jumbotron className="painel" style={{ background: '#8c6531' }}>
      <h1 className="pergunta">2) Outra pergunta apenas para imaginar o cenário:</h1>
      <Form style={{ background: '#8c6531' }}>
        <fieldset className="alternativasRadius">
          <Form.Group as={Row} className="mb-3">
            <Col sm={10}>
              <Form.Check
                style={{ color: '#fff' }}
                type="radio"
                label="resposta&nbsp;1"
                name="formHorizontalRadios"
                id="formHorizontalRadios4"
                className="alternativa"
              />
              <Form.Check
                style={{ color: '#fff' }}
                type="radio"
                label="resposta&nbsp;2"
                name="formHorizontalRadios"
                id="formHorizontalRadios5"
                className="alternativa"
              />
              <Form.Check
                style={{ color: '#fff' }}
                type="radio"
                label="resposta&nbsp;3"
                name="formHorizontalRadios"
                id="formHorizontalRadios6"
                className="alternativa"
              />
            </Col>
          </Form.Group>
        </fieldset>
      </Form>
    </Jumbotron>
    <div className="center">
      <Form.Group as={Row} className="mb-3">
        <Button type="submit" className="btnEnviarRespostas">ENVIAR&nbsp;RESPOSTAS</Button>
      </Form.Group>
    </div>
    <h1 className="nota center">Lembre-se: isso é só a sombra do que há de vir. #TMJADF</h1>
    <div className="centerImg">
      <img className="logoPablo" src={"img/pablo1.png"} alt="A Ciência da Riqueza"/>
    </div>
  </Container>
);

export default App;
