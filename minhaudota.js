const express = require("express");
const path = require("path")
const app = express();
const porta = 8000
const admin = require('firebase-admin');
var firebase = require("firebase");
app.use(express.static(path.join(__dirname, '/public/')));
require("firebase/auth");
require("firebase/firestore");
let serviceAccount = require('C:/Users/Mauricio/aula1-6a539-firebase-adminsdk-3t4g5-42fcec60fd.json');

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get('/index', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

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
  raca: 'SRD',
  sexo: 'Macho'
});

let aTuringRef = db.collection('gatos').doc('rajadinho');

let setAlan = aTuringRef.set({
  apelido: 'Rajadinho',
  castrado: 'Nao',
  cor: 'Rajado cinza',
  raca: 'SRD',
  sexo: 'Femea'
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