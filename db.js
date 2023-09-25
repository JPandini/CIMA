const mysql = require("mysql2/promise");
/* const client = mysql.createPool(process.env.CONNECTION_STRING); */
const client = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'cima'
}); 


//----------- Cidade -----------

async function selectCidades() {
    const results = await client.query("SELECT * FROM cidade;");
    return results[0]; 
}
async function selectCidade(id) { 
    const results = await client.query("SELECT * FROM cidade WHERE id=?;", [id]);
    return results[0];
}
async function insertCidade(cidade) {
    const results = await client.query("INSERT INTO cidade(nome) VALUES(?);", 
    [cidade.nome]);
}
async function updateCidade(id, cidade) { 
    const results = await client.query("UPDATE cidade SET nome=?  WHERE id=?", 
    [cidade.nome, id])
} 
async function deleteCidade(id) { 
    await client.query("DELETE FROM cidade WHERE id=?", [id]);
} 


//----------- Bairro -----------

async function selectBairros() {
    const results = await client.query("SELECT * FROM bairro;");
    return results[0]; 
}
async function selectBairro(id) { 
    const results = await client.query("SELECT * FROM bairro WHERE id=?;", [id]);
    return results[0];
}
async function insertBairro(bairro) {
    const results = await client.query("INSERT INTO bairro(nome, codcidade) VALUES(?, ?);", 
    [bairro.nome,  bairro.codcidade]);
}
async function updateBairro(id, bairro) { 
    const results = await client.query("UPDATE bairro SET nome=?, codcidade=? WHERE id=?", 
    [bairro.nome, bairro.codcidade, id])
} 
async function deleteBairro(id) { 
    await client.query("DELETE FROM bairro WHERE id=?", [id]);
} 


//----------- Endereço -----------

async function selectEnderecos() {
    const results = await client.query("SELECT * FROM endereco;");
    return results[0]; 
}
async function selectEndereco(id) { 
    const results = await client.query("SELECT * FROM endereco WHERE id=?;", [id]);
    return results[0];
}
async function insertEndereco(endereco) {
    const results = await client.query("INSERT INTO endereco(numero, complemento, rua, codbairro) VALUES(?,?,?,?);", 
    [ endereco.numero, endereco.complemento, endereco.rua, endereco.codbairro]);
}
async function updateEndereco(id, endereco) { 
    const results = await client.query("UPDATE endereco SET numero=?, complemento=?, rua=?, codbairro=? WHERE id=?",
    [endereco.numero, endereco.complemento, endereco.rua, endereco.codbairro, id])
} 
async function deleteEndereco(id) { 
    await client.query("DELETE FROM endereco WHERE id=?", [id]);
} 

//----------- Grupo -----------

async function selectGrupos() {
    const results = await client.query("SELECT * FROM grupo;");
    return results[0]; 
}
async function selectGrupo(id) { 
    const results = await client.query("SELECT * FROM grupo WHERE id=?;", [id]);
    return results[0];
}
async function insertGrupo(grupo) {
    const results = await client.query("INSERT INTO grupo(nome, codbairro) VALUES(?,?);", 
    [ grupo.nome, grupo.codbairro]);
}
async function updateGrupo(id, grupo) { 
    const results = await client.query("UPDATE grupo SET nome=?, codbairro=? WHERE id=?",
    [grupo.nome, grupo.codbairro, id])
} 
async function deleteGrupo(id) { 
    await client.query("DELETE FROM grupo WHERE id=?", [id]);
} 

//----------- Mensagem -----------

async function selectMensagens() {
    const results = await client.query("SELECT * FROM mensagens;");
    return results[0]; 
}
async function selectMensagem(id) { 
    const results = await client.query("SELECT * FROM mensagens WHERE id=?;", [id]);
    return results[0];
}
async function insertMensagem(mensagens) {
    const results = await client.query("INSERT INTO mensagens(conteudo, codusuario, tempo, codgrupo) VALUES(?,?,?,?);", 
    [ mensagens.conteudo, mensagens.codusuario, mensagens.tempo, mensagens.codgrupo]);
}
async function updateMensagem(id, mensagens) { 
    const results = await client.query("UPDATE grupo SET conteudo=?, codusuario=?, tempo=?, codgrupo=? WHERE id=?",
    [mensagens.conteudo, mensagens.codusuario, mensagens.tempo, mensagens.codgrupo, id])
} 
async function deleteMensagem(id) { 
    await client.query("DELETE FROM mensagens WHERE id=?", [id]);
} 


//----------- Postagem -----------

async function selectPostagens() {
    const results = await client.query("SELECT * FROM postagens;");
    return results[0]; 
}
async function selectPostagem(id) { 
    const results = await client.query("SELECT * FROM postagens WHERE id=?;", [id]);
    return results[0];
}
async function insertPostagem(postagens) {
    const results = await client.query("INSERT INTO postagens(data, titulo, conteudo, imagem, codusuario) VALUES(?,?,?,?);", 
    [ postagens.data, postagens.titulo, postagens.conteudo, postagens.imagem, postagens.codusuario]);
}
async function updatePostagem(id, postagens) { 
    const results = await client.query("UPDATE grupo SET data=?, titulo=?, conteudo=?, imagem=?, codusuario=? WHERE id=?",
    [postagens.data, postagens.titulo, postagens.conteudo, postagens.imagem, postagens.codusuario, id])
} 
async function deletePostagem(id) { 
    await client.query("DELETE FROM postagens WHERE id=?", [id]);
} 


//----------- Presidente -----------

async function selectPresidentes() {
    const results = await client.query("SELECT * FROM presidente;");
    return results[0]; 
}
async function selectPresidente(id) { 
    const results = await client.query("SELECT * FROM presidente WHERE id=?;", [id]);
    return results[0];
}
async function insertPresidente(presidente) {
    const results = await client.query("INSERT INTO presidente(nome, usuario, senha, email, codbairro) VALUES(?,?,?,?);", 
    [ presidente.nome, presidente.usuario, presidente.senha, presidente.email, presidente.codbairro]);
}
async function updatePresidente(id, presidente) { 
    const results = await client.query("UPDATE grupo SET nome=?, usuario=?, senha=?, email=?, codbairro=? WHERE id=?",
    [presidente.nome, presidente.usuario, presidente.senha, presidente.email, presidente.codbairro, id])
} 
async function deletePresidente(id) { 
    await client.query("DELETE FROM presidente WHERE id=?", [id]);
} 


//----------- Usuario -----------

async function selectUsuarios() {
    const results = await client.query("SELECT * FROM usuario;");
    return results[0]; 
}
async function selectUsuario(id) { 
    const results = await client.query("SELECT * FROM usuario WHERE id=?;", [id]);
    return results[0];
}
async function insertUsuario(usuario) {
    const results = await client.query("INSERT INTO usuario(nome, usuario, senha, endereco, email, cpf, codendereco) VALUES(?,?,?,?,?,?);", 
    [ usuario.nome, usuario.usuario, usuario.senha, usuario.endereco, usuario.email, usuario.cpf, usuario.codendereco, ]);
}
async function updateUsuario(id, usuario) { 
    const results = await client.query("UPDATE grupo SET nome=?, usuario=?, senha=?, endereco=?, email,=?, cpf=?, codendereco=? WHERE id=?",
    [usuario.nome, usuario.usuario, usuario.senha, usuario.endereco, usuario.email, usuario.cpf, usuario.codendereco, id])
} 
async function deleteUsuario(id) { 
    await client.query("DELETE FROM usuario WHERE id=?", [id]);
} 







module.exports = {
    selectCidades,
    selectCidade,
    insertCidade,
    updateCidade,
    deleteCidade,
    //-----------
    selectBairros,
    selectBairro,
    insertBairro,
    updateBairro,
    deleteBairro,
    //-----------
    selectEnderecos,
    selectEndereco,
    insertEndereco,
    updateEndereco,
    deleteEndereco,
    //------------
    selectGrupos,
    selectGrupo,
    insertGrupo,
    updateGrupo,
    deleteGrupo,
    //------------
    selectMensagens,
    selectMensagem,
    insertMensagem,
    updateMensagem,
    deleteMensagem,
    //------------
    selectPostagens,
    selectPostagem,
    insertPostagem,
    updatePostagem,
    deletePostagem,
    //------------
    selectPresidentes,
    selectPresidente,
    insertPresidente,
    updatePresidente,
    deletePresidente,
    //------------
    selectUsuarios,
    selectUsuario,
    insertUsuario,
    updateUsuario,
    deleteUsuario,
    //------------
};