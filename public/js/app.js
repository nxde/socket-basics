var socket=io();
var name=getQueryVariable("name") || "Anonymous";
var room=getQueryVariable("room");

jQuery(".room-title").text(room);

socket.on("connect",function(){
    console.log("Got through  to server with IO");
    socket.emit("joinRoom",{
        name:name,
        room:room
    });
});

socket.on("message",function(message){
    //console.log(message.text);
    var momentTimestamp=moment.utc(message.timestampt);
    var $messages=jQuery(".messages");
    var htmlNewMessage="<div>";
    htmlNewMessage+="<p><strong>"+message.name+" "+ momentTimestamp.local().format("h:mm a")+"</strong></p>";
    htmlNewMessage+="<p>"+message.text+"</p>";
    htmlNewMessage+="</div>";
    $messages.append(htmlNewMessage);
});



var $form=jQuery("#message-form");
$form.on("submit",function(event){
    event.preventDefault();
    var $message=$form.find("input[name=message]");
    socket.emit("message",{
        name:name,
        text: $message.val()
    });
    $message.val("");
});