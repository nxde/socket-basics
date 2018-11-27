var socket=io();
var name=getQueryVariable("name") || "Anonymous";
var room=getQueryVariable("room");

socket.on("connect",function(){
    console.log("Got through  to server with IO");
});

socket.on("message",function(message){
    //console.log(message.text);
    var momentTimestamp=moment.utc(message.timestampt);
    var $messages=jQuery(".messages");
    $messages.append("<p><strong>"+message.name+" "+ momentTimestamp.local().format("h:mm a")+"</strong></p>");
    $messages.append("<p>"+message.text+"</p>");
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