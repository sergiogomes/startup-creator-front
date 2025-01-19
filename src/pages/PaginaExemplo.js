import { 
  React,
  useEffect,
  //useState
} from 'react';

import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';  

import 'react-tiny-fab/dist/styles.css';

// import { notifyError } from '../utils/toasts';

// import api from '../services/api';

const PaginaExemplo = () => {

  // const [resultados, setResultados] = useState([]);

  // const getNomeServico = async () => {
  //   try {
  //     const { data } = await api.get(`/urlDaApi`);
  //     setResultados(data);
  //   } catch (error) {
  //     console.log(error);
  //     notifyError('Não foi possivel carregar nenhum resultado');
  //   }
  // };

  useEffect(() => {
    //getNomeServico();
  }, []);

  return (
    <Container className="p-3">
      <div className="centerImg">
        <Link to="/q">
          <img src={"img/logo-startup-creator.png"} alt="Startup Creator" width="280"/>
        </Link>
      </div>
      <br />
      <h3 className="center" style={{ paddingBottom: '20px' }}>
        Cadastro de produtos, aqui vamos utilizar os serviços e banco de dados que construimos.
      </h3>
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr className="linhas">
            <th>Id</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          <tr className="linhas">
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
        </tbody>
      </Table>
      <h1 className="center" style={{ fontWeight: 100, margin: '15px', fontSize: '15px' }}>
        Atenção: Você está próximo de concluir um ciclo que vai mudar o seu resultado para sempre!  
      </h1>
    </Container>
  );
};

export default PaginaExemplo;
