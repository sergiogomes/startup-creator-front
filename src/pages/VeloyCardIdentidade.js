import { React } from 'react';

import { Col, Button, Card, CardBody } from "reactstrap";
import Avatar from 'react-avatar';

import '../../src/App.css';

const VeloyCardIdentidade = ({ qgr }) => {
  return (
    <>
      <Col xl="3" sm="6">
        <Card className="espacoCartao">
            <CardBody>
                <div className="mt-0">
                    <Avatar className="rounded-circle header-profile-user me-3" name={qgr.nome} src={qgr.avatar} size="80" round={true} maxInitials={2}/>
                    <br /><br />
                </div>

                <h4
                  className="mt-0 font-size-15"
                >
                  {qgr.nome}
                </h4>
                <div>
                    {qgr.cargo ? (
                      <div className="d-grid mb-3">
                          <Button
                            color="secondary"
                            outline
                            className="waves-effect btn btn-lg btn-block font-size-10"
                          >
                            {qgr.cargo}
                          </Button>
                      </div>
                    ) : (
                      <></>
                    )}
                    {qgr.situacao ? (
                      <div className="d-grid mb-3">
                          <Button
                            color="secondary"
                            outline
                            className="waves-effect btn btn-lg btn-block font-size-10"
                          >
                            {qgr.situacao}
                          </Button>
                      </div>
                    ) : (
                      <></>
                    )}
                    {qgr.gestor ? (
                      <div className="d-grid mb-3">
                          <Button
                            color="secondary"
                            outline
                            className="waves-effect btn btn-lg btn-block font-size-10"
                          >
                            {qgr.gestor}
                          </Button>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="mt-0">
                        <div className="mt-0">
                            <h4 className="mt-0 font-size-16">
                              {qgr.area}
                            </h4>
                        </div>
                    </div>
                    
                </div>
            </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default VeloyCardIdentidade;
