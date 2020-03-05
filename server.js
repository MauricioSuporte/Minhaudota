var express = require("express"); 
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
//seta variáveis

usuarios = []; //array de usuários
conexoes = []; //array de conexão

server.listen(process.env.PORT || 3000);  //Porta local
console.log("Server Online");

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html"); //sincroniza com o html deste arquivo
});
app.get('/tela', function(req,res)
{
	io.sockets.emit("frame",req.query.screen);
	res.send("ok");
	setTimeout(() => {
		console.log
	}, 3000);
});
app.get('/joga', function(req,res)
{
	res.send("3");
});
io.sockets.on("connection", function(socket){
	//conexão
	conexoes.push(socket);
	console.log("Usuário desconectado. Total de usuários: %s", conexoes.length);
	
	//desconexão
	socket.on("disconnect", function(data){
  	usuarios.splice(usuarios.indexOf(socket.username), 1); //acessa o array de usuários
  	conexoes.splice(conexoes.indexOf(socket),1);
  	console.log("Usuário conectado. Total de usuários: %s ", conexoes.length);
	});

  socket.on("sendMessage", data => { 
    console.log(data);//Mostra o que os usuários escrevem no console
    io.sockets.emit("newMessage", data);
  });

  socket.on('mouse',
    function(data) {
      console.log("Received: 'mouse' " + data.x + " " + data.y);
      socket.broadcast.emit('mouse', data);

    }
  );
});
