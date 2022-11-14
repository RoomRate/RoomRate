const WebSocket = require(`ws`);

exports.setUpWebSocketServer2 = ({ server }) => {
  const wss = new WebSocket.Server({ server });

  wss.on(`connection`, (ws) => {
    ws.on(`message`, data => {
      const message = JSON.parse(data.toString());
      console.log(message);

      ws.send(JSON.stringify(message));
    });
  });
}
