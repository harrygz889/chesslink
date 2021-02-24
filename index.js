// require server packages
let express = require('express');
let socketio = require('socket.io');
let http = require('http');

// configure server packages
let app = express();
let server = http.createServer(app);
let io = socketio(server);

// require our ChessGame.js object
let ChessGame = require('./ChessGame');

// initialize the waiting player variable
let waitingPlayer;

// run our program logic when we receive a connection
io.on('connection', onConnection)

// set our port to the production port or localhost:5000 if running npm start from the terminal
app.set('port', (process.env.PORT || 5000));
// automatically serve files in the public directory
app.use(express.static(__dirname + '/public'));

// The below runs anytime a request comes into the "/" link ie "chess-whatever.com/"
// send the index.html page containing our client side scripts and board file
app.get('/', function(req, res) {
  res.sendFile('index.html');
});

// listen for requests on the port
server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// program logic
function onConnection(socket) {

  // tell the player they have connected
  socket.emit('msg', 'You have connected!')

  // if the player sends a chat, then emit that to all sockets connected to the server
  socket.on('msg', (text) => io.emit('msg', text))

  // matchmaking code, automatically creates a waiting player if there is none
  // creates the object exported in ChessGame.js
  if(waitingPlayer) {
    new ChessGame(waitingPlayer, socket)
    waitingPlayer = null
  }
  else {
    waitingPlayer = socket
    socket.emit('msg', 'You are waiting for a second player...')
  }
}
