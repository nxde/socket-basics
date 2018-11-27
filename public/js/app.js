var socket=io();

socket.on("connect",function(){
    console.log("Got through  to server with IO");
});