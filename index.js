const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const nodemailer = require('nodemailer');

const port = process.env.PORT || 8000;
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));



const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['X-Total-Count'],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Sua rota inicial
app.get('/', (req, res) => {
  res.send('Olá! Sua API está funcionando.');
});






// Rota protegida

function verificaAutenticacao(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token.split(' ')[1], 'secretpassphrase');
    req.usuario = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token expirado, envie um novo token
      const novoToken = jwt.sign({ email: req.usuario.email }, 'secretpassphrase', { expiresIn: '5h' });
      console.log('Novo token gerado:', novoToken);

      // Configure o novo token no header antes de continuar
      res.setHeader('Authorization', `Bearer ${novoToken}`);

      // Continue para a rota com o novo token
      next();
    } else {
      return res.status(401).json({ mensagem: 'Token inválido' });
    }
  }
}

app.get('/dados-autenticados', verificaAutenticacao, (req, res) => {
  // Adicione o decoded à resposta para que esteja disponível para o usuário
  res.json({ mensagem: 'Estes são os dados autenticados!', decoded: req.usuario });
});





app.get('/dadosGrafico/:codbairro?', async (req, res) => {
  try {
    const { codbairro } = req.params;

    let usuariosCadastrados;
    let presidentesCadastrados;

    if (codbairro) {
      // Se codbairro existir, busca dados específicos do bairro
      usuariosCadastrados = await db.selectUsuariosPorBairro(codbairro);
      presidentesCadastrados = await db.selectPresidentesPorBairro(codbairro);
    } else {
      // Se codbairro não existir, busca dados gerais
      usuariosCadastrados = await db.selectUsuarios();
      presidentesCadastrados = await db.selectPresidentes();
    }

    res.json({ usuariosCadastrados, presidentesCadastrados });
  } catch (error) {
    console.error('Erro ao obter dados para o gráfico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.get('/postagem/usuario/:codusuario', async (req, res) => {
  try {
    const { codusuario } = req.params;
    const postagens = await db.selectPostagensByUsuario(codusuario);
    res.json(postagens);
  } catch (error) {
    console.error('Erro ao obter postagens por usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/postagem/bairro/:idBairro', async (req, res) => {
  try {
    const { idBairro } = req.params;

    if (isNaN(idBairro)) {
      // Se idBairro não for um número, retorne um erro ou um valor padrão
      return res.status(400).json({ error: 'O ID do bairro deve ser um número válido' });
    }

    const postagens = await db.selectPostagensByBairro(idBairro);
    res.json(postagens);
  } catch (error) {
    console.error('Erro ao obter postagens por bairro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});





//----------------admin-----------------------

app.delete("/admin/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteAdmin(id);
  res.sendStatus(204);
});
app.patch("/admin/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const admin = req.body;
  await db.updateAdmin(id, admin);
  res.sendStatus(200);
});
app.post("/admin", async (req, res) => {
  const admin = req.body;
  await db.insertAdmin(admin);
  res.sendStatus(201);
});
app.get("/admin/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectAdmin(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/admin", async (req, res) => {
  const results = await db.selectAdmins();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

//loginAdmin
app.post("/adminlogin", async (req, res) => {
  const admin = req.body;
  const results = await db.selectAdminLogin(admin.email, admin.senha);

  if (results.length > 0) {
    const token = jwt.sign({ email: admin.email, senha: admin.senha }, 'secretpassphrase', { expiresIn: '9h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

//loginPresidente
app.post("/presidentelogin", async (req, res) => {
  const admin = req.body;
  const results = await db.selectPresidenteLogin(admin.email, admin.senha);

  if (results && results.length > 0) {
    const { id, codbairro, email } = results[0];
    const token = jwt.sign({ email, id, codbairro }, 'secretpassphrase', { expiresIn: '9h' });
    res.json({ token, id,codbairro });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});


//usuario login

app.post("/usuariologin", async (req, res) => {
  const usuario = req.body;

  try {
    const user = await db.selectUsuarioLogin(usuario.email, usuario.senha);

    if (user && user.length > 0) {
      // Usuário encontrado
      res.status(200).json({ success: true, usuario: user[0] });
    } else {
      // Usuário não encontrado
      res.status(404).json({ success: false, message: 'Usuário não encontrado. Verifique seu email.' });
    }
  } catch (error) {
    console.error("Erro durante o login:", error);
    res.status(500).json({ success: false, message: 'Erro ao tentar fazer login. Tente novamente mais tarde.' });
  }
});

//usuario temporario login

app.post("/usuariotemplogin", async (req, res) => {
  const usuario_temp = req.body;

  try {
    const user = await db.selectUsuarioTempLogin(usuario_temp.email, usuario_temp.senha);

    if (user && user.length > 0) {
      // Usuário encontrado
      res.status(200).json({ success: true, usuario_temp: user[0] });
    } else {
      // Usuário não encontrado
      res.status(404).json({ success: false, message: 'Usuário não encontrado. Verifique seu email.' });
    }
  } catch (error) {
    console.error("Erro durante o login:", error);
    res.status(500).json({ success: false, message: 'Erro ao tentar fazer login. Tente novamente mais tarde.' });
  }
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


//----------------Postagem-----------------------
app.delete("/postagem/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deletePostagem(id); 
  res.sendStatus(204);
});
app.patch("/postagem/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const postagem = req.body;
  await db.updatePostagem(id, postagem);
  res.sendStatus(200);
});

app.post("/postagem", async (req, res) => {
  try {
    const postagem = req.body;

    if (!postagem.imagem) {
      return res.status(400).json({ error: 'Nenhuma imagem encontrada na requisição' });
    }
    await db.insertPostagem(postagem);
    res.sendStatus(201);
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});
 
app.get("/postagem/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectPostagem(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/postagem", async (req, res) => {
  const results = await db.selectPostagens();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

//----------------Presidente-----------------------
app.delete("/presidente/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deletePresidente(id); 
  res.sendStatus(204);
});
app.patch("/presidente/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const presidente = req.body;
  await db.updatePresidente(id, presidente);
  res.sendStatus(200);
});
app.post("/presidente", async (req, res) => {
  const presidente = req.body;
  await db.insertPresidente(presidente);
  res.sendStatus(201);
});
app.get("/presidente/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectPresidente(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/presidente", async (req, res) => {
  const results = await db.selectPresidentes();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

//----------------Usuario-----------------------
app.delete("/usuario/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteUsuario(id); 
  res.sendStatus(204);
});

app.post("/usuario",  async (req, res) => {
  const usuario = req.body;
  await db.insertUsuario(usuario);
  res.sendStatus(201);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,    
    secure: true, 
    auth: {
      user: 'cimabairros@gmail.com',
      pass: 'zksn nbdj knjg ubqt',
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    }
  });

  
  const info = await transporter.sendMail({
    from: 'cimabairros@gmail.com',
    to: usuario.email,
    subject: 'Solicitação aprovada!',
    text: 'Parabéns! Sua conta foi aprovada no aplicativo CIMA. att. equipe CIMA',
    html: '<p>Parabéns! Sua conta foi aprovada!</p>',
  });

});


app.get("/usuario/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectUsuario(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/usuario", async (req, res) => {
  const results = await db.selectUsuarios();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

app.patch("/usuario/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuario = req.body;

    if (!usuario.imagem) {
      return res.status(400).json({ error: 'Nenhuma imagem encontrada na requisição' });
    }


    await db.updateUsuario(id, usuario);

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

//----------------Usuario temporario-----------------------
app.delete("/usuario_temp/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteUsuarioTemporario(id); 
  res.sendStatus(204);
});
app.patch("/usuario_temp/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario_temp = req.body;
  await db.updateUsuarioTemporario(id, usuario_temp);
  res.sendStatus(200);
});

app.post("/usuario_temp", async (req, res) => {
  const usuario_temp = req.body;
  await db.insertUsuarioTemporario(usuario_temp);
  res.sendStatus(201);

  


  


});
app.get("/usuario_temp/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectUsuarioTemporario(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/usuario_temp", async (req, res) => {
  const results = await db.selectUsuariosTemporarios();
  res.header('X-Total-Count', results.length);
  res.json(results);
});



app.listen(port, "0.0.0.0", () => {
  console.log(`App is running on port ${port}`);
});