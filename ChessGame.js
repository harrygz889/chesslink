class ChessGame {
  constructor(socket_1, socket_2) {
    this._white_player = socket_1
    this._black_player = socket_2
    this._players = [this._white_player, this._black_player]

    // swap color for _black_player
    this._black_player.emit('changeColor')

    this._startGame()
  }

  _startGame() {
    this._players.map ( player => {
      player.emit('msg', 'Match Starts')
    })

    //handle move for _white_player
    this._white_player.on('move', move => {
      this._black_player.emit('servermove', move)
      console.log('_white_player: ', move)
    })
    //handle move for _black_player
    this._black_player.on('move', move => {
      this._white_player.emit('servermove', move)
      console.log('_black_player: ', move)
    })

    // handle disconnections
    this._white_player.on('disconnect', () => {
      this._black_player.emit('msg', 'White disconnected... you win!')
    })

    this._black_player.on('disconnect', () => {
      this._white_player.emit('msg', 'Black disconnected... you win!')
    })
  }
}

module.exports = ChessGame;
