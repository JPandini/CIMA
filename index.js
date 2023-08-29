require('dotenv').config();
const db = require('./db');

net = require("net")
net.createServer( (socket) => {
  socket.write("<?xml version=\"1.0\"?>\n")
  socket.write("<!DOCTYPE cross-domain-policy SYSTEM \"http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd\">\n")
  socket.write("<cross-domain-policy>\n")
  socket.write("<allow-access-from domain=\"*\" to-ports=\"*\"/>\n")
  socket.write("</cross-domain-policy>\n")
  socket.end()}
).listen(843)
 

const cors = require('cors'); 


const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

  
app.delete("/clientes/:id", async (req, res) => {
    const id = parseInt(req.params.id); 
    await db.deleteCustomer(id);
    res.sendStatus(204);
});

app.patch("/clientes/:id", async (req, res) => {
    const id = parseInt(req.params.id); 
    const customer = req.body; 
    await db.updateCustomer(id, customer); 
    res.sendStatus(200);
});

app.post("/clientes", async (req, res) => { 
    const customer = req.body; 
    await db.insertCustomer(customer); 
    res.sendStatus(201);
});

app.get("/clientes", async (req, res) => {
    const nome = req.params.nome; 
    const results = await db.selectCustomerNome(nome); 
    res.json(results);
});

app.get("/clientes/:id", async (req, res) => {
    const id = parseInt(req.params.id); 
    const results = await db.selectCustomer(id); 
    res.json(results);
});

app.get("/clientes", async (req, res) => {
    const results = await db.selectCustomers();
    res.json(results);
});

app.get("/", (req, res) => {
    res.json({ message: "hello" });
});

app.listen(process.env.PORT, () => {
    console.log("App is running now!");
});