const WebSocket = require(`ws`);

exports.setUpWebSocketServer = ({ server }) => {
  const wss = new WebSocket.Server({ server });

  wss.on(`connection`, (ws) => {
    ws.on(`message`, data => {
      const message = JSON.parse(data.toString());
      console.log(message);

      ws.send(JSON.stringify(message));
    });
  });
};
