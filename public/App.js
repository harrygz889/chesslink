function Button(_ref) {
  var socket = _ref.socket;

  var data = React.useState('find a game');
  return React.createElement(
    'button',
    null,
    data
  );
}

function App(props) {
  var socket = io();
  React.useEffect(function () {
    socket.emit('react');
    console.log(socket);
  });
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      null,
      'Hello, ',
      props.name
    ),
    React.createElement(Button, { socket: socket })
  );
}

var element = React.createElement(App, { name: 'Sara' });
ReactDOM.render(element, document.getElementById('react_app'));