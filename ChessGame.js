class ChessGame {
  constructor(sock1, sock2) {
    this._sock1 = sock1
    this._sock2 = sock2
    this._players = [sock1, sock2]
    this._initSockets()
    sock2.emit('changeColor')
  }

  _initSockets() {
    this._players.forEach((sock, index) => {
      sock.emit('msg', 'Match Starts')
    })
    //handle move sock1
    this._sock1.on('move', (move) => {
      this._sock2.emit('servermove', move)
      //log it
      console.log('sock1move', move)
    })
    //handle move sock2
    this._sock2.on('move', (move) => {
      this._sock1.emit('servermove', move)
      //log it
      console.log('sock2move', move)
    })
  }
  _handleMove1(data) {
    console.log('handlemove1', data)
    //this._sock2.emit('move', data)
  }
  _handleMove2(data) {
    console.log('handlemove2', data)
    //this._sock1.emit('move', data)
  }
}

module.exports = ChessGame;
