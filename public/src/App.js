function Button({socket}) {
  const data = React.useState('find a game');
  return <button>{data}</button>;
}

function App(props) {
  const socket = io();
  React.useEffect(() => {
    socket.emit('react');
    console.log(socket)
  })
    return (
      <div>
        <h1>Hello, {props.name}</h1>
        <Button socket={socket}></Button>
      </div>
    );
  }
  
  const element = <App name="Sara" />;
  ReactDOM.render(
    element,
    document.getElementById('react_app')
  );