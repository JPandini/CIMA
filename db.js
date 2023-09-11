const mysql = require("mysql2/promise");
/* const client = mysql.createPool(process.env.CONNECTION_STRING); */
const client = mysql.createPool({
    host     : '%10.107.0.32',
    user     : 'root',
    password : 'cima',
    database : 'cima'
  });

async function selectCustomers() {
    const results = await client.query("SELECT * FROM clientes;");
    return results[0]; 
}

async function selectCustomer(id) { 
    const results = await client.query("SELECT * FROM clientes WHERE id=?;", [id]);
    return results[0];
}


async function insertCustomer(customer) {
    const results = await client.query("INSERT INTO clientes(nome, idade) VALUES(?,?);", 
    [customer.nome, customer.idade]);
}

async function updateCustomer(id, customer) { // Renomeado para updateCustomer
    const results = await client.query("UPDATE clientes SET nome=?, idade=? WHERE id=?", [customer.nome, customer.idade, id])
}

async function deleteCustomer(id) { // Renomeado para deleteCustomer
    await client.query("DELETE FROM clientes WHERE id=?", [id]);
}

module.exports = {
    selectCustomers,
    selectCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer,

};
