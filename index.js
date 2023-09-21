require('dotenv').config();
const express = require('express');
const cors = require('cors');
const net = require("net");
const db = require('./db');
const app = express();
const port = process.env.PORT || 843;

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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

//----------------cidade-----------------------

app.delete("/cidade/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteCidade(id);
  res.sendStatus(204);
});
app.patch("/cidade/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const cidade = req.body;
  await db.updateCidade(id, cidade);
  res.sendStatus(200);
});
app.post("/cidade", async (req, res) => {
  const cidade = req.body;
  await db.insertCidade(cidade);
  res.sendStatus(201);
});
app.get("/cidade/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectCidade(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/cidade", async (req, res) => {
  const results = await db.selectCidades();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

//----------------bairro-----------------------
app.delete("/bairro/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteBairro(id);
  res.sendStatus(204);
});
app.patch("/bairro/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const bairro = req.body;
  await db.updateBairro(id, bairro);
  res.sendStatus(200);
});
app.post("/bairro", async (req, res) => {
  const bairro = req.body;
  await db.insertBairro(bairro);
  res.sendStatus(201);
});
app.get("/bairro/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectBairro(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/bairro", async (req, res) => {
  const results = await db.selectBairros();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

//----------------endereco-----------------------
app.delete("/endereco/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteEndereco(id);
  res.sendStatus(204);
});
app.patch("/endereco/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const endereco = req.body;
  await db.updateEndereco(id, endereco);
  res.sendStatus(200);
});
app.post("/endereco", async (req, res) => {
  const endereco = req.body;
  await db.insertEndereco(endereco);
  res.sendStatus(201);
});
app.get("/endereco/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectEndereco(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/endereco", async (req, res) => {
  const results = await db.selectEnderecos();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

//----------------grupo-----------------------
app.delete("/grupo/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteGrupo(id); 
  res.sendStatus(204);
});
app.patch("/grupo/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const grupo = req.body;
  await db.updateGrupo(id, grupo);
  res.sendStatus(200);
});
app.post("/grupo", async (req, res) => {
  const grupo = req.body;
  await db.insertGrupo(grupo);
  res.sendStatus(201);
});
app.get("/grupo/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectGrupo(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/grupo", async (req, res) => {
  const results = await db.selectGrupos();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

//----------------mensagem-----------------------
app.delete("/mensagem/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteMensagem(id); 
  res.sendStatus(204);
});
app.patch("/mensagem/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const mensagem = req.body;
  await db.updateMensagem(id, mensagem);
  res.sendStatus(200);
});
app.post("/mensagem", async (req, res) => {
  const mensagem = req.body;
  await db.insertMensagem(mensagem);
  res.sendStatus(201);
});
app.get("/mensagem/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectMensagem(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/mensagem", async (req, res) => {
  const results = await db.selectMensagens();
  res.header('X-Total-Count', results.length);
  res.json(results);
});