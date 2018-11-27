var PORT=process.env.PORT || 3000;
var express=require("express");
var app=express();
var http=require("http").Server(app);
var io=require("socket.io")(http);
var moment=require("moment");

io.on("connection",function(socket){
    console.log("User connected with IO");

    socket.on('disconnect', function(){
        console.log('user disconnected');
      });

    socket.on("message",function(message){
        console.log("Message received: "+message.text);

        //Send to all: socket.broadcast.emit("message",message);
        message.timestamp=moment().valueOf();
        socket.broadcast.emit("message",message);
    });

    socket.emit("message",{
        name:"System",
        text:"Welcome to the chat app",
        timestamp:moment().valueOf()
    });
});

app.use(express.static(__dirname+"/public"));
// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/public/index.html');
//   });

app.get('/iochat', function(req, res){
    res.sendFile(__dirname + '/public/iochat.html');
});

http.listen(PORT, function(){
    console.log("Server  listening");
});
