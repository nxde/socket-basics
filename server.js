var PORT=process.env.PORT || 3000;
var express=require("express");
var app=express();
var http=require("http").Server(app);
var io=require("socket.io")(http);
var moment=require("moment");

var clientInfo={};

function sendCurrentUsers(socket){
    var info=clientInfo[socket.id];
    var users=[];

    if(typeof info === "undefined"){
        return;
    }
    Object.keys(clientInfo).forEach(function(socketId){
        var userInfo=clientInfo[socketId];
        if(info.room === userInfo.room){
            users.push(userInfo.name);
        }
    });

    socket.emit("message",{
        name:"System",
        text:"Current users: "+users.join(", "),
        timestamp: moment().valueOf()
    });
}

io.on("connection",function(socket){
    console.log("User connected with IO");

    socket.on('disconnect', function(){
        console.log('user disconnected');
        var userData=clientInfo[socket.id];
        if(typeof userData !== "undefined"){
            socket.leave(userData.room);
            io.to(userData.room).emit("message",{
                name:"System",
                text:userData.name+" has left!",
                timestamp:moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
      });

    socket.on("joinRoom",function(req){
        clientInfo[socket.id]=req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit("message",{
            name:"System",
            text: req.name+" has joined!",
            timestamp:moment().valueOf()
        });
    });

    socket.on("message",function(message){
        console.log("Message received: "+message.text);
        if(message.text === "@currentUsers"){
            sendCurrentUsers(socket);
        }
        else{
            message.timestamp=moment().valueOf();            
            //Send to all: 
            io.to(clientInfo[socket.id].room).emit("message",message);
            //Send to all but the sender:
            //socket.broadcast.emit("message",message);
        }
        
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
