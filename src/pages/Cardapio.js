import { React, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';

import api from '../services/api';

const Cardapio = () => {

  const [pudins, setPudins] = useState([]);

  const pesquisarCardapio = async () => {
    await api.get(`/cardapio`).then((res) => {
      setPudins(res.data);
    });
  }

  useEffect(() => {
    pesquisarCardapio();
  }, []);

  return (
    <Container className="p-3" style={{ background: '#FFF' }}>
        <>
          {pudins.map((pudim) => {
            return (
              <>
                <p>{`${pudim.nome} - ${pudim.preco}`}</p>
              </>
            )
          })}
        </>
    </Container>
  );
};

export default Cardapio;
