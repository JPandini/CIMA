require('dotenv').config();
const express = require('express');
const cors = require('cors');
const net = require("net");
const db = require('./db');

const app = express();
const port = process.env.PORT || 843; // Use a porta 843 se a variável de ambiente PORT não estiver definida

// Configurar o servidor TCP
net.createServer((socket) => {
  socket.write("<?xml version=\"1.0\"?>\n");
  socket.write("<!DOCTYPE cross-domain-policy SYSTEM \"http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd\">\n");
  socket.write("<cross-domain-policy>\n");
  socket.write("<allow-access-from domain=\"*\" to-ports=\"*\"/>\n");
  socket.write("</cross-domain-policy>\n");
  socket.end();
}).listen(843);

app.use(express.json());
app.use(cors({ 
  exposedHeaders: ['X-Total-Count'],
}));

// Configurar política de Cross-Origin Resource Sharing (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Rota para exclusão de cliente por ID
app.delete("/clientes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteCustomer(id);
  res.sendStatus(204);
});

// Rota para atualização de cliente por ID
app.patch("/clientes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const customer = req.body;
  await db.updateCustomer(id, customer);
  res.sendStatus(200);
});

// Rota para criação de cliente
app.post("/clientes", async (req, res) => {
  const customer = req.body;
  await db.insertCustomer(customer);
  res.sendStatus(201);
});

// Rota para busca de cliente por ID
app.get("/clientes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectCustomer(id);

  if (results) {
    res.json({ data: results }); // Retorna os resultados dentro de um objeto 'data'
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});

// Rota para listar todos os clientes
app.get("/clientes", async (req, res) => {
  const results = await db.selectCustomers();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
