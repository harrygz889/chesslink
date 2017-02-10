var express = require('express');
var socketio = require('socket.io');
var http = require('http');

var app = express();
let server = http.createServer(app);
var io = socketio(server)

io.on('connection', onConnection)


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
  res.sendFile('index.html');
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function onConnection(socket) {
  socket.emit('msg', 'You have connected!')

  socket.on('msg', (text) => io.emit('msg', text))
}
