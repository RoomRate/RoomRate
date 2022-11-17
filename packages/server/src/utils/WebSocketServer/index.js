const WebSocket = require(`ws`);
const { v4 } = require(`uuid`);

const clients = [];

exports.setUpWebSocketServer = ({ server }) => {
  const wss = new WebSocket.Server({ server });

  wss.on(`connection`, (ws) => {
    const clientId = v4();
    ws.clientId = clientId;
    clients.push(ws);

    ws.on(`message`, data => {
      const message = JSON.parse(data.toString());

      clients.forEach(client => {
        client.send(JSON.stringify(message));
      });
    });

    ws.on(`close`, () => {
      clients.splice(clients.findIndex(client => client.clientId === clientId), 1);
    });
  });
};
