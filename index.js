let express = require('express');
let socketio = require('socket.io');
let http = require('http');

let app = express();
let server = http.createServer(app);
let io = socketio(server);
let ChessGame = require('./ChessGame');


let waitingPlayer;

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

  //!!!!!!!!!!!change this to only emit to the other player ***!!!!!!!!!!!!!!!!!!!
  socket.on('disconnect', () => io.emit('msg', 'Player disconnected'))

  socket.on('move', (data) => console.log('server move data', data))

  if(waitingPlayer) {
    new ChessGame(waitingPlayer, socket)
    waitingPlayer = null
  }
  else {
    waitingPlayer = socket
    socket.emit('msg', 'You are waiting for a second player...')
  }
}
