import { React, useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Search';
import { Container, Row, Col, Button, Input } from "reactstrap";

import api from '../services/api';

import '../../src/App.css';

import VeloyCardIdentidade from './VeloyCardIdentidade';

const VeloyCard = () => {

  const [identidades, setIdentidades] = useState([]);

  const pesquisarInput = () => {
      document.getElementById('input-filtro').value = '';

      let objDiv = document.getElementById('input-filtro');
      objDiv.scrollTop = objDiv.scrollHeight;

      document.getElementById('input-filtro').focus();

      setIdentidades([]);
  }

  const pesquisarIdentidades = async () => {
      try {
          const filtroInputValue = document.getElementById('input-filtro').value;
          if (!(filtroInputValue.length > 2)) {
              toast.error('Digite pelo menos 3 letras');
              return;
          }

          await api.get(`/identidade?filtro=${filtroInputValue}`)
          .then(({ data })=> {
              setIdentidades(data);
          }); 
      } catch (error) {
          console.log(error);
      }
  }

  const setEventos = () => {
    document.addEventListener('keyup', handleEnter);
    document.addEventListener('keyup', handleEsc);
  }

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        pesquisarIdentidades();
    }
  };

  const handleEsc = (e) => {
    if (e.keyCode === 27) {
        e.preventDefault();
        pesquisarInput();
    }
  };

  useEffect(() => {
    document.getElementById('input-filtro').focus();
    setEventos();
  }, []);

  return (
    <Container className="p-3">
      <div className="">
          <Container>
              <Row>
                  <Col lg={12}>
                      <div className="text-center my-5">
                          <h1 className="fw-bold text-error">
                              <img src={"img/logo-veloy-preto.png"} alt="" style={{ width: '200px', borderRadius: 10 }} />
                          </h1>
                          <div className="mb-4">
                              <Input
                                  id="input-filtro"
                                  type="text"
                                  placeholder="Digite aqui..."
                                  className="form-control form-control-lg"
                                  style={{ backgroundColor: 'white' }}
                              />
                          </div>
                          <div className="">
                              <Button
                                  color="primary"
                                  className="btn btn-primary btn-lg btn-block"
                                  onClick={() => pesquisarIdentidades()}
                              >
                                  LOCALIZAR
                              </Button>
                          </div>
                          <br />
                          <Row>
                              {identidades.length > 0 ? (
                                  <>
                                  {identidades.map((qgr, key) => (
                                    <VeloyCardIdentidade qgr={qgr} key={"_qgr_" + key} />
                                  ))}
                                  </>
                              ) : (
                                  <>
                                  </>
                              )}
                          </Row>
                      </div>
                  </Col>
              </Row>
          </Container>
      </div>
      <div 
        style={{
            right: 20,
            bottom: 20,
            position: 'fixed',
            zIndex: 9999
        }}
        onClick={() => pesquisarInput()}
        >
            <Fab
            variant="extended"
            >
                <NavigationIcon sx={{ mr: 1 }} /> Pesquisar
            </Fab>
      </div>
    </Container>
  );
};

export default VeloyCard;
