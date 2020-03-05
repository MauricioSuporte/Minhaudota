const firebase = require('firebase');

var config = {
  apiKey: "AIzaSyCvcys472PWjGKvWFSmozSXnA7u8GB6Uuo",
  authDomain: "aula1-6a539.firebaseapp.com",
  databaseURL: "https://aula1-6a539.firebaseio.com",
  projectId: "aula1-6a539",
  storageBucket: "aula1-6a539.appspot.com",
  messagingSenderId: "922310172497",
  appId: "1:922310172497:web:7f6e7d95b130faeb9f3d70",
  measurementId: "G-XCB174Z3WN"
};

firebase.initializeApp(config);

module.exports.SignUpWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      return JSON.stringify(user)
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'autor/weak-password') {
        return { err: 'Senha muito fraca' }
      } else {
        return { err: errorMessage }
      }
      return { err: error }
    });
}

module.exports.SignInWithEmailAndPassword = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        return { err: 'Senha incorreta.' }
      } else {
        return { err: errorMessage }
      }
      return { err: error }
    });
}

module.exports.InputData = (comentario) => {
  return firebase.database().ref('gatos').push({
    comentario
  })
    .then(function () {
      console.log('Sincronizado com sucesso.');
    })
    .catch(function (error) {
      console.log('Sincronização falhou.');
    });
}

module.exports.GetData = () => {
  let data = []
  return firebase.database().ref('users').once('value')
    .then((snapshot) => {

      snapshot.forEach((childSnapshot) => {
        data.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        })
      })
      console.log(data)
      return data;
    })
}
return module.exports