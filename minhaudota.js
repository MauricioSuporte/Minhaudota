const express = require("express");
const path = require("path")
const app = express();
const porta = 8000
const admin = require('firebase-admin');
var firebase = require("firebase");
const multer = require("multer");
const fs = require('fs');
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.urlencoded());
app.use(express.json());
require("firebase/auth");
require("firebase/firestore");
let serviceAccount = require('C:/Users/Mauricio/aula1-6a539-firebase-adminsdk-3t4g5-42fcec60fd.json');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aula1-6a539.firebaseio.com"
});

let db = admin.firestore();

app.set('view engine', 'ejs');

const upload = multer({ storage })

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: "./public" });
});

app.get('/inicio', function (req, res) {
  let arquivo = fs.readFileSync('./public/inicio.html').toString();
  var alteracoes = "";

  db.collection('gatos').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        let obj = doc.data();
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
        <p>${obj.obervacao}</p>
        <div class="comentario">
          <textarea rows="3" cols="50" placeholder="Comente algo sobre este gato."></textarea>
        </div>
        <button class="btn btn-third" type="submit" onclick="redirectToIndex()">Comentar</button>
      </div>`
      });

      arquivo = arquivo.replace("$bloco", alteracoes);

      res.send(arquivo);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
});

//upload
app.post("/inicio", upload.single("file"), async (req, res) => {
  let arquivo = fs.readFileSync('./public/inicio.html').toString();
  let alteracoes = "";

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

  db.collection('gatos').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        let obj = doc.data();
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
        <div class="comentario">
          <textarea rows="3" cols="50" placeholder="Comente algo sobre este gato."></textarea>
        </div>
        <button class="btn btn-third" type="submit" onclick="redirectToIndex()">Comentar</button>
      </div>`
      });

      arquivo = arquivo.replace("$bloco", alteracoes);

      res.send(arquivo);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

  //res.sendFile('inicio.html', { root: "./public" });
})

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

app.listen(8000, function () {
  console.log('Server up na porta 8000!');
});

let docRef = db.collection('gatos').doc('laranjnha');

let user = docRef.set({
  apelido: 'Cenoura',
  castrado: 'Castrado',
  cor: 'Laranja rajado',
  tamanho: 'Adulto',
  raca: 'SRD',
  sexo: 'Macho',
  caracteristica: 'Rabo curto',
  obervacao: 'Bem dengoso',
  imagem: 'gato1.png',
});

let aTuringRef = db.collection('gatos').doc('rajadinho');

let gato1 = aTuringRef.set({
  apelido: 'Bolud',
  castrado: 'Não castrado',
  cor: 'Laranja rajado',
  tamanho: 'Adulto',
  raca: 'SRD',
  sexo: 'Macho',
  caracteristica: 'Rabo curto',
  obervacao: 'Bem dengoso',
  imagem: 'gato2.png',
});
