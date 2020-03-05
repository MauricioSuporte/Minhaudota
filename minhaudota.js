const express = require("express");
const path = require("path");
const app = express();
const porta = 8000
const admin = require('firebase-admin');
const firebase = require("firebase");
const multer = require("multer");
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();
app.use(express.static(path.join(__dirname, '/public/')));
const Auth = require('./firebase.js');
require("firebase/auth");
app.use(express.urlencoded());
app.use(express.json());
require("firebase/firestore");
const serviceAccount = require('./aula1-6a539-firebase-adminsdk-3t4g5-42fcec60fd.json');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
app.set('view engine', 'ejs');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aula1-6a539.firebaseio.com"
});
const db = admin.firestore();
const upload = multer({ storage })

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userLogged = user
  } else {
    userLogged = null
  }
})

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: "./public" });
});

//Cria novo usuário
app.post('/createuser', (req, res) => {
  Auth.SignUpWithEmailAndPassword(req.body.email, req.body.password).then((user) => {
    if (!user.err) {
      let userData = JSON.parse(user)
      userData = userData.user
      let docRef = db.collection('usuarios').doc(req.body.nome);

      let setAda = docRef.set({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.password
      });
      res.redirect('/')
    } else {
      return user.err
    }
  })
})

//Renderiza login
app.post('/login', (req, res) => {
  let getBody = req.body;
  Auth.SignInWithEmailAndPassword(getBody.email, getBody.password)
    .then((login) => {
      if (!login.err) {
        res.redirect('/inicio')
      } else {
        res.redirect('/')
      }
    })
})

//Renderiza página inicio
app.get('/inicio', function (req, res) {
  let arquivo = fs.readFileSync('./public/inicio.html').toString();
  var alteracoes = "";

  //Insere gatos no html
  db.collection('gatos').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        let obj = doc.data();

        var alteracoesComentario = "";
        alteracoes = alteracoes +
          `<div class="col-3 bloco-texto bloco-imagem">
        <img src="http://localhost:8000/img/${obj.imagem}">
        <p><b>${obj.apelido}</b></p>
        <p>${obj.castrado}</p>
        <p>${obj.cor}</p>
        <p>${obj.tamanho}</p>
        <p>${obj.raca}</p>
        <p>${obj.sexo}</p>
        <p>${obj.caracteristica}</p>
        <p>${obj.observacao}</p>
        <div class="comentarios">
          <!-- comentarios -->
        </div >
        <div class="comentario">
          <textarea rows="3" cols="50" placeholder="Comente algo sobre este gato."></textarea>
        </div>
        <button class="btn btn-third" type="submit">Comentar</button>
      </div > `

        //Insere comentarios nos gatos
        if (obj.comentario1 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario1.autor}: </b>${obj.comentario1.comentario}</p>`
        }
        if (obj.comentario2 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario2.autor}: </b>${obj.comentario2.comentario}</p>`
        }
        if (obj.comentario3 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario3.autor}: </b>${obj.comentario3.comentario}</p>`
        }
        if (obj.comentario4 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario4.autor}: </b>${obj.comentario4.comentario}</p>`
        }
        if (obj.comentario5 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario5.autor}: </b>${obj.comentario5.comentario}</p>`
        }
        if (obj.comentario6 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario6.autor}: </b>${obj.comentario6.comentario}</p>`
        }
        if (obj.comentario7 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario7.autor}: </b>${obj.comentario7.comentario}</p>`
        }
        if (obj.comentario8 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario8.autor}: </b>${obj.comentario8.comentario}</p>`
        }
        if (obj.comentario9 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario9.autor}: </b>${obj.comentario9.comentario}</p>`
        }
        if (obj.comentario10 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario10.autor}: </b>${obj.comentario10.comentario}</p>`
        }

        alteracoes = alteracoes.replace("<!-- comentarios -->", alteracoesComentario);

      });
      arquivo = arquivo.replace("<!-- bloco -->", alteracoes);

      res.send(arquivo);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
});

//Inserir novo gato
app.post("/inicio", upload.single("file"), async (req, res) => {
  let arquivo = fs.readFileSync('./public/inicio.html').toString();
  let alteracoes = "";
  var alteracoesComentario = "";

  let docRefe = db.collection('gatos').doc(req.body.apelido);

  console.log(req.file);

  let setCat = await docRefe.set({
    apelido: req.body.apelido,
    caracteristica: req.body.caracteristica,
    castrado: req.body.castrado,
    cor: req.body.cor,
    observacao: req.body.observacao,
    raca: req.body.raca,
    sexo: req.body.sexo,
    tamanho: req.body.tamanho,
    imagem: req.file.filename
  });

  //Insere gatos no html
  db.collection('gatos').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        let obj = doc.data();

        var alteracoesComentario = "";
        alteracoes = alteracoes +
          `<div class="col-3 bloco-texto bloco-imagem">
        <img src="http://localhost:8000/img/${obj.imagem}">
        <p><b>${obj.apelido}</b></p>
        <p>${obj.castrado}</p>
        <p>${obj.cor}</p>
        <p>${obj.tamanho}</p>
        <p>${obj.raca}</p>
        <p>${obj.sexo}</p>
        <p>${obj.caracteristica}</p>
        <p>${obj.observacao}</p>
        <div class="comentarios">
          <!-- comentarios -->
        </div >
        <div class="comentario">
          <textarea rows="3" cols="50" placeholder="Comente algo sobre este gato."></textarea>
        </div>
        <button class="btn btn-third" type="submit">Comentar</button>
      </div > `

        //Insere comentarios nos gatos
        if (obj.comentario1 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario1.autor}: </b>${obj.comentario1.comentario}</p>`
        }
        if (obj.comentario2 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario2.autor}: </b>${obj.comentario2.comentario}</p>`
        }
        if (obj.comentario3 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario3.autor}: </b>${obj.comentario3.comentario}</p>`
        }
        if (obj.comentario4 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario4.autor}: </b>${obj.comentario4.comentario}</p>`
        }
        if (obj.comentario5 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario5.autor}: </b>${obj.comentario5.comentario}</p>`
        }
        if (obj.comentario6 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario6.autor}: </b>${obj.comentario6.comentario}</p>`
        }
        if (obj.comentario7 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario7.autor}: </b>${obj.comentario7.comentario}</p>`
        }
        if (obj.comentario8 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario8.autor}: </b>${obj.comentario8.comentario}</p>`
        }
        if (obj.comentario9 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario9.autor}: </b>${obj.comentario9.comentario}</p>`
        }
        if (obj.comentario10 != undefined) {
          alteracoesComentario = alteracoesComentario +
            `<p><b>${obj.comentario10.autor}: </b>${obj.comentario10.comentario}</p>`
        }

        alteracoes = alteracoes.replace("<!-- comentarios -->", alteracoesComentario);

      });
      arquivo = arquivo.replace("<!-- bloco -->", alteracoes);

      res.send(arquivo);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
})

//Cadastra novo usuário
app.post("/cadastro", (req, res) => {
  res.sendFile('index.html', { root: "./public" });
  let docRef = db.collection('usuarios').doc(req.body.nome);

  let setAda = docRef.set({
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha
  });
  console.log(req.body);
})

//Porta disponivel para teste
app.listen(8000, function () {
  console.log('Server up na porta 8000!');
});