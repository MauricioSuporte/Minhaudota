const express = require("express");
const path = require("path")
const app = express();
const porta = 8000
const admin = require('firebase-admin');
var firebase = require("firebase");
const multer = require("multer");
app.use(express.static(path.join(__dirname, '/public/')));
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

app.set('view engine', 'ejs');

const upload = multer({ storage })

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: "./public" });
});

app.get('/inicio', function (req, res) {
  res.sendFile('inicio.html', { root: "./public" });
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("Arquivo recebido!")
})

app.listen(8000, function () {
  console.log('Server up na porta 8000!');
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aula1-6a539.firebaseio.com"
});

let db = admin.firestore();

let docRef = db.collection('gatos').doc('laranjnha');

let setAda = docRef.set({
  apelido: 'Cenoura',
  castrado: 'Sim',
  cor: 'Laranja rajado',
  tamanho: 'Adulto',
  raca: 'SRD',
  sexo: 'Macho',
  caracteristica: 'Rabo curto',
  obervacao: 'Bem dengoso'
});

let aTuringRef = db.collection('gatos').doc('rajadinho');

let setAlan = aTuringRef.set({
  apelido: 'Rajadinho',
  castrado: 'Nao',
  cor: 'Rajado cinza',
  tamanho: 'bebe',
  raca: 'SRD',
  sexo: 'Femea',
  caracteristica: 'orelha direita cortada',
  obervacao: 'Bem dengoso'
});

db.collection('gatos').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
