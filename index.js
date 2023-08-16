require('dotenv').config();
const db = require('./db');

const express = require('express');
const app = express();

app.use(express.json());

app.delete("/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id); // Correção: req.params, não res.params
    db.deleteCustumer(id);
    res.sendStatus(204); // Correção: res, não response
});

app.patch("/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id); // Correção: req.params, não res.params
    const customer = req.body; // Correção: req.body, não request.body
    db.updateCustomer(id, customer); // Correção: updateCustomer, não updateCostumer
    res.sendStatus(200);
});

app.post("/clientes", async (req, res) => {
    const customer = req.body; // Correção: req.body, não request.body
    await db.insertCustomer(customer); // Correção: insertCustomer, não insertCostumer
    res.sendStatus(201);
});

app.get("/clientes/:id", async (req, res) => {
    const id = parseInt(req.params.id); // Correção: req.params, não res.params
    const results = await db.selectCustomer(id); // Correção: selectCustomer, não selectCustomers
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