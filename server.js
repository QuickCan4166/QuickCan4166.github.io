const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

const rooms = {};

server.on('connection', (socket) => {
  socket.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'join':
        if (!rooms[data.room]) rooms[data.room] = [];
        rooms[data.room].push(socket);
        console.log(`User joined ${data.room}`);
        break;

      case 'leave':
        rooms[data.room] = rooms[data.room].filter((s) => s !== socket);
        console.log(`User left ${data.room}`);
        break;

      case 'message':
        console.log(`Message in ${data.room}: ${data.message}`);
        if (rooms[data.room]) {
          rooms[data.room].forEach((s) => {
            if (s !== socket) {
              s.send(JSON.stringify({ sender: 'User', message: data.message }));
            }
          });
        }
        break;
    }
  });

  socket.on('close', () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((s) => s !== socket);
    }
    console.log('User disconnected');
  });
});

console.log('WebSocket server started on ws://localhost:3000');
