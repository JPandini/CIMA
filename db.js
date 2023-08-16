const mysql = require("mysql2/promise");
const client = mysql.createPool(process.env.CONNECTION_STRING);

async function selectCustomers() {
    const results = await client.query("SELECT * FROM clientes;");
    return results[0];
}

async function selectCustomer(id) { // Renomeado para selectCustomer
    const results = await client.query("SELECT * FROM clientes WHERE id=?;", [id]);
    return results[0];
}

async function insertCustomer(customer) {
    const values = [customer.nome, customer.idade];
    const results = await client.query("INSERT INTO clientes(nome, idade) VALUES(?,?);", values);
}

async function updateCustomer(id, customer) { // Renomeado para updateCustomer
    // Lógica para atualização de cliente
}

async function deleteCustomer(id) { // Renomeado para deleteCustomer
    // Lógica para exclusão de cliente
}

module.exports = {
    selectCustomers,
    selectCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer
};