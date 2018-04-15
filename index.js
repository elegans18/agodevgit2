var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users={};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){  
  socket.on('new user',function(data, callback){
    if(data in users){
      callback(false);
    }else{
      callback(true);
      socket.nickname=data;
      users[socket.nickname]=socket;
      io.sockets.emit('usernames',Object.keys(users));
    }
  });

  socket.on('chat message', function(msg){
    var mesaj=msg.trim();
    if(mesaj.substr(0,2)==='/w'){
      mesaj=mesaj.substr(3);
      var ind=mesaj.indexOf(' ');
      if(ind !== -1){
        var name=mesaj.substring(0,ind);
        var mesaj=mesaj.substring(ind + 1);
        if(name in users){
          users[name].emit('whisper',{mesaj : mesaj, nick: socket.nickname});
          users[socket.nickname].emit('whisper',{mesaj : mesaj, nick: socket.nickname});
          console.log('whisper '+socket.nickname+" : "+name+" : "+mesaj);
        }
      }else{
      }
    }else{
    console.log(socket.nickname +" : " + msg);
    io.sockets.emit('chat message', {mesaj:msg,nick:socket.nickname});   
    }   
  });

  socket.on('disconnect', function(){
    if(!socket.nickname) return;
    console.log(socket.nickname+' çıkış yaptı.');    
    nicknames.pop(socket.nickname);
    io.sockets.emit('usernames',Object.keys(users));
  });
});

http.listen(3000, function(){
  console.log('Port dinleniyor :3000');
});
    