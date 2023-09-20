const mysql = require("mysql2/promise");
/* const client = mysql.createPool(process.env.CONNECTION_STRING); 
 */

const client = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'admin1234',
    database : 'cima'
}); 

async function selectCustomers() {
    const results = await client.query("SELECT * FROM cidade;");
    return results[0]; 
}

async function selectCustomer(id) { 
    const results = await client.query("SELECT * FROM cidade WHERE id=?;", [id]);
    return results[0];
}


async function insertCustomer(customer) {
    const results = await client.query("INSERT INTO cidade(nome) VALUES(?);", 
    [customer.nome]);
}

async function updateCustomer(id, customer) { // Renomeado para updateCustomer
    const results = await client.query("UPDATE cidade SET nome=?  WHERE id=?", [customer.nome, id])
} 
 
async function deleteCustomer(id) { // Renomeado para deleteCustomer
    await client.query("DELETE FROM cidade WHERE id=?", [id]);
} 

module.exports = {
    selectCustomers,
    selectCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer,

};
