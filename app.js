var app = require('express')();
var server = app.listen(3000, function() {
    console.log('listening on *:3000');
 });
//var http = require('http').Server(app);
var io = require('socket.io').listen(server);

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    global.localStorage = new LocalStorage('./scratch');
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');  
});

const connections = [];

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
    connections.push(socket);
   console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
     socket.on('disconnect', () => {
      connections.splice(connections.indexOf(socket), 1);
   });

//    function ClearRecord() {
//     localStorage.clear();
//     console.log('clear');
//   }
  
//   setTimeout(ClearRecord, 4000);
  
   var obj = JSON.parse(localStorage.getItem("enquiry"));
   io.sockets.emit('View Record', {enquiry:JSON.stringify(obj)});

   socket.on('sending message', (name,number,message) => {
    var obj = [];
    obj.push({name: name, number: number,message:message})
    var jsonString = JSON.stringify(obj);
    if(localStorage.length == 0){
        obj.push({name: name, number: number,message: message});  
        localStorage.setItem('enquiry',jsonString);
    }
    else{
        var obj = JSON.parse(localStorage.getItem("enquiry"));
        obj.push({name: name, number: number,message: message}); 
        localStorage.setItem('enquiry',JSON.stringify(obj));
    }
    console.log('Message is received :',name,number, message);
    obj = JSON.parse(localStorage.getItem("enquiry"));
    io.sockets.emit('View Record', {enquiry:JSON.stringify(obj)});
 });

 //delete
 socket.on('Delete message', (id) => {
    var obj = [];
        var obj = JSON.parse(localStorage.getItem("enquiry"));
        var enquiry = JSON.stringify(obj);
    console.log(enquiry[0]);
    io.sockets.emit('Delete Record', {enquiry:'tets'});
 });

});

// http.listen(3000, function() {
//    console.log('listening on *:3000');
// });
