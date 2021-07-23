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

// The below runs anytime a request comes into the "/" link ie "chess-whatever.com/"
// send the index.html page containing our client side scripts and board file

// need to attatch socket to req object
app.use('/',function(req, res, next){
  console.log("A new request received at " + Date.now());
  next();
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// automatically serve files in the public directory
app.use(express.static(__dirname + '/public'));

// listen for requests on the port
server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// program logic
function onConnection(socket) {

  // tell the player they have connected
  socket.emit('msg', 'You have connected.')

  // socket joins game room with  unique id
  socket.on('join', (game_id) => {
    socket.join(game_id)
    socket.on('msg', (text) => {
      socket.emit('msg', text)
      socket.to(game_id).emit('msg', text)
    })
    // send game URL to client
    socket.emit('msg', 'Your game URL is:')
    socket.emit('msg', `https://chesslink.app/?gameid=${game_id}`)
    if(io.sockets.adapter.rooms.get(game_id).size === 2) {
      var players = io.sockets.adapter.rooms.get(game_id).values();

      player_1 = io.sockets.sockets.get(players.next().value);
      player_2 = io.sockets.sockets.get(players.next().value);
      
      new ChessGame(player_1, player_2, game_id)
    }
  })
 }
