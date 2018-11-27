var socket=io();

socket.on("connect",function(){
    console.log("Got through  to server with IO");
});

socket.on("message",function(message){
    //console.log(message.text);
    jQuery(".messages").append("<p>"+message.text+"</p>");
});



var $form=jQuery("#message-form");
$form.on("submit",function(event){
    event.preventDefault();
    var $message=$form.find("input[name=message]");
    socket.emit("message",{
        text: $message.val()
    });
    $message.val("");
});