require('dotenv').config();
const db = require('./db');

const express = require('express');
const app = express();

app.use(express.json());

app.delete("/clientes/:id", (req, res)=>{
    const id = parseInt(res.params.id);
    db.deleteCostumer(id);
    response.sendStatus(204);
})

app.patch("/clientes/:id", (req, res)=>{
    const id = parseInt(res.params.id);
    const costumers = request.body;
    db.updateCostumer(id, costumers);
    res.sendStatus(200);
})

app.post("/clientes", (req, res)=>{
    const costumers = request.body;
    db.insertCostumer(costumers);
    res.sendStatus(201);
})

app.get("/clientes/:id", async (req, res)=>{
    const id = parseInt(res.params.id);
    const results = await db.selectCustomers(id);
    res.json(results);
}) 

app.get("/clientes", async (req, res)=>{
    const results = await db.selectCustomers();
    res.json(results);
})


app.get("/", (req, res)=>{
    res.json({message:"hello"})
})

app.listen(process.env.PORT, ()=>{
    console.log("App is running now!")
});