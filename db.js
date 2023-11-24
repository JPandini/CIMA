const mysql = require("mysql2/promise");
const client = mysql.createPool(process.env.CONNECTION_STRING); 
const fs = require('fs').promises; // Use fs.promises para operações assíncronas
const path = require('path');


//----------- Admin -----------

async function selectAdmins() {
    const results = await client.query("SELECT * FROM admin;");
    return results[0]; 
}
async function selectAdmin(id) { 
    const results = await client.query("SELECT * FROM admin WHERE id=?;", [id]);
    return results[0];
}
async function insertAdmin(admin) {
    const results = await client.query("INSERT INTO admin(email, nome, usuario, senha) VALUES(? ,?, ?, ?);", 
    [admin.email ,admin.nome, admin.usuario, admin.senha]);
}
async function updateAdmin(id, admin) { 
    const results = await client.query("UPDATE admin SET email=?, nome=?, usuario=?, senha=?  WHERE id=?", 
    [admin.email ,admin.nome, admin.usuario, admin.senha, id])
} 
async function deleteAdmin(id) { 
    await client.query("DELETE FROM admin WHERE id=?", [id]);
} 

async function selectAdminLogin(email, senha) {
    const query = "SELECT * FROM admin WHERE email = ? AND senha = ?";
    try {
        const results = await client.query(query, [email, senha]);
        return results[0]; // Retorna a primeira linha dos resultados
    } catch (error) {
        console.error("Erro na consulta SQL:", error);
        return [];
    }

}


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
    const results = await client.query("INSERT INTO mensagens(descricao, codusuario, tempo) VALUES(?,?,?);", 
    [ mensagens.descricao, mensagens.codusuario, mensagens.tempo]);
}
async function updateMensagem(id, mensagens) { 
    const results = await client.query("UPDATE mensagens SET descricao=?, codusuario=?, tempo=?,  WHERE id=?",
    [mensagens.descricao, mensagens.codusuario, mensagens.tempo, id])
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
    try {
        const results = await client.query("INSERT INTO postagens(data, titulo, descricao, codusuario, imagem) VALUES(?,?,?,?,?);",
        [postagens.data, postagens.titulo, postagens.descricao, postagens.codusuario, postagens.imagem]);
    
        if (results.affectedRows === 0) {
        throw new Error('Usuário não encontrado para atualização');
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error; 
    }
    }


async function updatePostagem(id, postagens) {
    const results = await client.query("UPDATE postagens SET data=?, titulo=?, descricao=?, codusuario=? imagem=? WHERE id=?",
        [postagens.data, postagens.titulo, postagens.descricao, postagens.codusuario,postagens.imagem, id]
        );
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
    const results = await client.query("INSERT INTO presidente(nome, usuario, senha, email, codbairro) VALUES(?,?,?,?,?);", 
    [ presidente.nome, presidente.usuario, presidente.senha, presidente.email, presidente.codbairro]);
}
async function updatePresidente(id, presidente) { 
    const results = await client.query("UPDATE presidente SET nome=?, usuario=?, senha=?, email=?, codbairro=? WHERE id=?",
    [presidente.nome, presidente.usuario, presidente.senha, presidente.email, presidente.codbairro, id])
} 
async function deletePresidente(id) { 
    await client.query("DELETE FROM presidente WHERE id=?", [id]);
} 

async function selectPresidenteLogin(email, senha) {
    const query = "SELECT id, codbairro, email FROM presidente WHERE email = ? AND senha = ?";
    try {
      const results = await client.query(query, [email, senha]);
      return results[0];
    } catch (error) {
      console.error("Erro na consulta SQL:", error);
      return null; // Alterado para retornar null em caso de erro
    }
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
    const results = await client.query("INSERT INTO usuario(nome, usuario, senha, email, cpf, numero_casa, rua, complemento, codbairro, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", 
    [ usuario.nome, usuario.usuario, usuario.senha, usuario.email, usuario.cpf, usuario.numero_casa, usuario.rua, usuario.complemento, usuario.codbairro, usuario.imagem ]);
}
async function updateUsuario(id, usuario) { 
    try {
      const results = await client.query("UPDATE usuario SET nome=?, usuario=?, senha=?, email=?, cpf=?, numero_casa=?, rua=?, complemento=?, codbairro=?, imagem=? WHERE id=?",
        [usuario.nome, usuario.usuario, usuario.senha, usuario.email, usuario.cpf, usuario.numero_casa, usuario.rua, usuario.complemento, usuario.codbairro, usuario.imagem, id]);
  
      // Verifica se a atualização foi bem-sucedida
      if (results.affectedRows === 0) {
        throw new Error('Usuário não encontrado para atualização');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error; // Propaga o erro para que possa ser tratado na rota
    }
  }

async function deleteUsuario(id) { 
    await client.query("DELETE FROM usuario WHERE id=?", [id]);
}
async function updateUsuarioImagem(id, imagem) { 
    const results = await client.query("UPDATE usuario SET imagem=? WHERE id=?", [imagem, id]);
}

async function selectUsuarioLogin(email, senha) {
    const query = "SELECT * FROM usuario WHERE email = ? AND senha = ?";
    try {
        const results = await client.query(query, [email, senha]);
        return results[0]; 
    } catch (error) {
        console.error("Erro na consulta SQL:", error);
        return [];
    }

}

//----------- Usuario_Temporário -----------

async function selectUsuariosTemporarios() {
    const results = await client.query("SELECT * FROM usuario_temp;");
    return results[0]; 
}
async function selectUsuarioTemporario(id) { 
    const results = await client.query("SELECT * FROM usuario_temp WHERE id=?;", [id]);
    return results[0];
}
async function insertUsuarioTemporario(usuario_temp) {
    const results = await client.query("INSERT INTO usuario_temp(nome, usuario, senha, email, cpf, numero_casa, rua, complemento, codbairro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", 
    [usuario_temp.nome, usuario_temp.usuario, usuario_temp.senha, usuario_temp.email, usuario_temp.cpf, usuario_temp.numero_casa, usuario_temp.rua, usuario_temp.complemento, usuario_temp.codbairro]);
}

async function updateUsuarioTemporario(id, usuario_temp) { 
    const results = await client.query("UPDATE usuario_temp SET nome=?, usuario=?, senha=?, email=?, cpf=?, numero_casa=?, rua=?, complemento=?, codbairro=?  WHERE id=?",
    [ usuario_temp.nome, usuario_temp.usuario, usuario_temp.senha, usuario_temp.email, usuario_temp.cpf, usuario_temp.numero_casa, usuario_temp.rua, usuario_temp.complemento, usuario_temp.codbairro, id])
} 
async function deleteUsuarioTemporario(id) { 
    await client.query("DELETE FROM usuario_temp WHERE id=?", [id]);
}


async function selectUsuarioTempLogin(email, senha) {
    const query = "SELECT * FROM usuario_temp WHERE email = ? AND senha = ?";
    try {
        const results = await client.query(query, [email, senha]);
        return results[0]; 
    } catch (error) {
        console.error("Erro na consulta SQL:", error);
        return [];
    }

}




async function selectUsuariosPorBairro(codbairro) {
    const query = codbairro ? "SELECT * FROM usuario WHERE codbairro = ?;" : "SELECT * FROM usuario;";
    const results = await client.query(query, codbairro ? [codbairro] : []);
    return results[0];
  }
  
  async function selectPresidentesPorBairro(codbairro) {
    const query = codbairro ? "SELECT * FROM presidente WHERE codbairro = ?;" : "SELECT * FROM presidente;";
    const results = await client.query(query, codbairro ? [codbairro] : []);
    return results[0];
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
    selectPresidenteLogin,
    //------------
    selectUsuarios,
    selectUsuario,
    insertUsuario,
    updateUsuario,
    deleteUsuario,
    selectUsuarioLogin,
    updateUsuarioImagem,
    //------------
    selectAdmins,
    selectAdmin,
    insertAdmin,
    updateAdmin,
    deleteAdmin,
    selectAdminLogin,
    //------------
    selectUsuariosTemporarios,
    selectUsuarioTemporario,
    insertUsuarioTemporario,
    updateUsuarioTemporario,
    deleteUsuarioTemporario,
    selectUsuarioTempLogin,
    //------------
    selectUsuariosPorBairro,
    selectPresidentesPorBairro,
};