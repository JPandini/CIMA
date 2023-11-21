const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 8000;
const jwt = require('jsonwebtoken');


const server = http.createServer(app);
const io = socketIO(server);


app.use(express.json());

// Configure o CORS apenas uma vez com as opções desejadas
const corsOptions = {
  origin: 'http://localhost:3000', // Substitua pelo domínio real do seu front-end
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Habilita o uso de cookies/sessões em solicitações cruzadas
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
app.get('/api/dados-autenticados', verificaAutenticacao, (req, res) => {
  // Lógica para fornecer os dados autenticados
  res.json({ mensagem: 'Estes são os dados autenticados!' });
  
});

// Função para verificar a autenticação
function verificaAutenticacao(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  // Verifique o token JWT e, se for válido, continue para a rota
  try {
    const decoded = jwt.verify(token.split(' ')[1], 'secretpassphrase');
    req.usuario = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token expirado, envie um novo token
      const novoToken = jwt.sign({ email: req.usuario.email }, 'secretpassphrase', { expiresIn: '5h' });
      res.setHeader('Authorization', `Bearer ${novoToken}`);
      next();
    } else {
      return res.status(401).json({ mensagem: 'Token inválido' });
    }
  }
}




io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Função para obter os dados reais da sua API
  const obterDadosReais = async () => {
    try {
      const usuariosCadastrados = await db.selectUsuarios(); // Substitua pelo método correto da sua API
      const presidentesCadastrados = await db.selectPresidentes(); // Substitua pelo método correto da sua API

      // Emitir os dados para os clientes conectados
      socket.emit('dadosAtualizados', { usuariosCadastrados, presidentesCadastrados });
    } catch (error) {
      console.error('Erro ao obter dados reais:', error.message);
    }
  };

  // Emitir os dados iniciais ao conectar
  obterDadosReais();

  // Exemplo: emitir dados a cada segundo
  setInterval(obterDadosReais, 1000);
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

app.post("/adminlogin", async (req, res) => {
  const admin = req.body;
  const results = await db.selectAdminLogin(admin.email, admin.senha);

  if (results.length > 0) {
    const token = jwt.sign({ email: admin.email }, 'secretpassphrase', { expiresIn: '5h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
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

//----------------endereco-----------------------
app.delete("/endereco/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteEndereco(id);
  res.sendStatus(204);
});
app.patch("/endereco/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const endereco = req.body;
  await db.updateEndereco(id, endereco);
  res.sendStatus(200);
});
app.post("/endereco", async (req, res) => {
  const endereco = req.body;
  await db.insertEndereco(endereco);
  res.sendStatus(201);
});
app.get("/endereco/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectEndereco(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/endereco", async (req, res) => {
  const results = await db.selectEnderecos();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

//----------------grupo-----------------------
app.delete("/grupo/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteGrupo(id); 
  res.sendStatus(204);
});
app.patch("/grupo/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const grupo = req.body;
  await db.updateGrupo(id, grupo);
  res.sendStatus(200);
});
app.post("/grupo", async (req, res) => {
  const grupo = req.body;
  await db.insertGrupo(grupo);
  res.sendStatus(201);
});
app.get("/grupo/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectGrupo(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/grupo", async (req, res) => {
  const results = await db.selectGrupos();
  res.header('X-Total-Count', results.length);
  res.json(results);
});

//----------------mensagem-----------------------
app.delete("/mensagem/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.deleteMensagem(id); 
  res.sendStatus(204);
});
app.patch("/mensagem/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const mensagem = req.body;
  await db.updateMensagem(id, mensagem);
  res.sendStatus(200);
});
app.post("/mensagem", async (req, res) => {
  const mensagem = req.body;
  await db.insertMensagem(mensagem);
  res.sendStatus(201);
});
app.get("/mensagem/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await db.selectMensagem(id);
  if (results) {
    res.json({ data: results }); 
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});
app.get("/mensagem", async (req, res) => {
  const results = await db.selectMensagens();
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
  const postagem = req.body;
  await db.insertPostagem(postagem);
  res.sendStatus(201);
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
app.patch("/usuario/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = req.body;
  await db.updateUsuario(id, usuario);
  res.sendStatus(200);
});
app.post("/usuario", async (req, res) => {
  const usuario = req.body;
  await db.insertUsuario(usuario);
  res.sendStatus(201);
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