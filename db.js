const mysql = require("mysql2/promise");

const client = mysql.createPool(process.env.CONNECTION_STRING);

async function selectCustomers() {
    const results = await client.query("SELECT * FROM clientes;"); //await só vai pra linha de baixo quando é executado
    return results[0];
}

/* async function selectCustomers(id) {
    const results = await client.query("SELECT * FROM clientes WHERE id=?;", [id]);
    return results[0];
} */





module.exports = {selectCustomers,

}