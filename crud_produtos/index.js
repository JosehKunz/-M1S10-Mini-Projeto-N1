const express = require('express');
const Yup = require('yup');
const app = express();
const PORT = 3333;

app.use(express.json());

let produtos = [];

const produtoSchema = Yup.object().shape({
    nome: Yup.string().required(),
    preco: Yup.number().positive().required(),
    descricao: Yup.string().notRequired(),
});

async function validarDadosProduto(req, res, next) {
    try {
        await produtoSchema.validate(req.body);
        next();
    } catch (error) {
        return res.status(400).send(error.errors);
    }
}

// Função extra: Rota OPTIONS
app.options('*', (req, res) => {
    res.send('GET, POST, PUT, PATCH, DELETE');
});

// 1. Tarefa 1: Criar Produto
app.post('/produtos', validarDadosProduto, (req, res) => {
    const { nome, preco, descricao } = req.body;
    const produto = { id: produtos.length + 1, nome, preco, descricao };
    produtos.push(produto);
    res.status(201).send('Produto adicionado com sucesso.');
});

// 1. Tarefa 2: Listar Produtos
app.get('/produtos', (req, res) => {
    res.json(produtos);
});

// 1. Tarefa 3: Atualizar Produto
app.put('/produtos/:id', validarDadosProduto, (req, res) => {
    const { id } = req.params;
    const index = produtos.findIndex(produto => produto.id === parseInt(id));
    if (index === -1) {
        return res.status(404).send('Produto não encontrado.');
    }
    const { nome, preco, descricao } = req.body;
    produtos[index] = { ...produtos[index], nome, preco, descricao };
    res.status(200).send('Produto atualizado com sucesso.');
});

// Função extra: Atualização Parcial (PATCH)
app.patch('/produtos/:id', validarDadosProduto, (req, res) => {
    const { id } = req.params;
    const index = produtos.findIndex(produto => produto.id === parseInt(id));
    if (index === -1) {
        return res.status(404).send('Produto não encontrado.');
    }
    produtos[index] = { ...produtos[index], ...req.body };
    res.status(200).send('Produto atualizado parcialmente com sucesso.');
});

// 1. Tarefa 4: Excluir Produto
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const index = produtos.findIndex(produto => produto.id === parseInt(id));
    if (index === -1) {
        return res.status(404).send('Produto não encontrado.');
    }
    produtos.splice(index, 1);
    res.status(200).send('Produto deletado com sucesso.');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
