
$(document).ready(function() {

  //TODO:
  // Refactor with React

  //initialize socket.io
  var socket = io();

  // create and append dom element using JQuery
  function onMessage(text) {
    var $el = document.createElement('li')
    $el.innerHTML = text
    $("#chat").append($el)
  }

  // subscribe to msg with socket.io
  socket.on('msg', onMessage)

  // emit msg and prevent the default form submit behavior
  $("#chat-form").on("submit", function(event){
    var value = $("#chat-input").val()
    $("#chat-input").val("") // reset input element
    socket.emit('msg', value)
    event.preventDefault()
  })

  // initialize new instance of Chess.js (https://github.com/jhlywa/chess.js/blob/master/README.md)
  var game = new Chess()

  // run when piece is picked up,
  // these methods are configured according to the chessboard.js specs (https://chessboardjs.com/)
  var onDragStart = function(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    // only pick up pieces for the side to move
    if (game.game_over() === true ||
       (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
       (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
       return false;
    }
    // only allows you to pick up pieces of the side nearest you
    if ((orientation === 'white' && piece.search(/^w/) === -1) ||
       (orientation === 'black' && piece.search(/^b/) === -1)) {
       return false;
    }
  };

  // runs when piece is released
  var onDrop = function(source, target) {

  // logging the move to the chrome console (not the server console)
    console.log('source', source)
    console.log('target', target)


  // see if the move is legal using chess.js
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for UI simplicity atm
    });

    // illegal move because the call to game.move above returned null
    if (move === null) return 'snapback';

    // emit move event via the socket.io instance we created on line 8
    socket.emit('move', {source: source, target: target})
  };

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion

  // TODO:
  // Delete this function, move shouldn't be rendered until the socket emits the move
  var onSnapEnd = function() {
    board.position(game.fen());
  };


  var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  };

  // configure board
  var board = ChessBoard('board', cfg);



  // create a move string from the source and target of the move object
  // reflect that move in the game
  // reflect the new game fen on the board position
  socket.on('servermove', function(move) {
    moveString = "" + move.source + "-" + move.target;
    console.log('PlayerMove:', moveString);
    game.move(moveString, {sloppy: true});
    board.position(game.fen());
  })

  // flip color on board
  socket.on('changeColor', function() {
    board.flip()
  })
});
