import { 
  React,
  useEffect,
  useState
} from 'react'

import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'  
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import 'react-tiny-fab/dist/styles.css'

import { notifyError } from '../utils/toasts'

import api from '../services/api'

const PaginaExemplo = () => {

  const [produtos, setProdutos] = useState([])
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getProdutos = async () => {
    try {
      const { data } = await api.get(`/produtos`)
      setProdutos(data)
    } catch (error) {
      console.log(error)
      notifyError('Não foi possivel carregar nenhum produto')
    }
  }

  const apagarProdutos = async (id) => {
    try {
      await api.delete(`/produtos/${id}`).then(() => getProdutos())
    } catch (error) {
      console.log(error)
      notifyError('Não foi possivel apagar o produto')
    }
  }

  const pesquisarProdutoParaEditar = async (id) => {
    try {
      handleShow()

      await api.get(`/produtos/${id}`)
        .then(({ data }) => {
          const { idprodutos, nome, preco, descricao } = data
          document.getElementById('idprodutos').value = idprodutos
          document.getElementById('nome').value = nome
          document.getElementById('preco').value = preco
          document.getElementById('descricao').value = descricao
        })
    } catch (error) {
      console.log(error)
      notifyError('Não foi possivel pesquisar o produto para editar')
    }
  }

  const cadastrarProduto = async () => {
    try {
      const existeIdNoProduto = document.getElementById('idprodutos').value
      if (existeIdNoProduto) {
        atualizarProduto(existeIdNoProduto)
      }

      const novoProduto = {
        nome: document.getElementById('nome').value,
        preco: document.getElementById('preco').value || 0,
        descricao: document.getElementById('descricao').value,
      }
      await api.post(`/produtos`, novoProduto).then(() => {
        getProdutos()
        handleClose()
      })
    } catch (error) {
      console.log(error)
      notifyError('Não foi possivel cadastrar o produto')
    }
  }

  const atualizarProduto = async (id) => {
    try {
      const produto = {
        nome: document.getElementById('nome').value,
        preco: document.getElementById('preco').value,
        descricao: document.getElementById('descricao').value,
      }
      await api.put(`/produtos/${id}`, produto).then(() => {
        getProdutos()
        handleClose()
      })
    } catch (error) {
      console.log(error)
      notifyError('Não foi possivel atualizar o produto')
    }
  }

  useEffect(() => getProdutos(), [])

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
            <th>Atualizar</th>
            <th>Apagar</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.idprodutos} className="linhas">
              <td>{produto.idprodutos}</td> 
              <td>{produto.nome}</td>
              <td>{produto.preco}</td>
              <td>{produto.descricao}</td>
              <td><button type="button" className="btn btn-secondary" onClick={() => pesquisarProdutoParaEditar(produto.idprodutos)}>Editar</button></td>
              <td><button type="button" className="btn btn-danger" onClick={() => apagarProdutos(produto.idprodutos)}>Apagar</button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h1 className="center" style={{ fontWeight: 100, margin: '15px', fontSize: '15px' }}>
        Atenção: Você está próximo de concluir um ciclo que vai mudar o seu resultado para sempre!  
      </h1>

      <Button variant="primary" onClick={handleShow}>
        Cadastrar Produto
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control type="hidden" id="idprodutos" />
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do produto aqui"
                autoFocus
                id="nome"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite o preço do produto aqui"
                id="preco"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control as="textarea" rows={3} id="descricao" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={cadastrarProduto}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default PaginaExemplo
