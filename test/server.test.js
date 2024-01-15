import { expect } from 'chai';
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Handle HTTP requests
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// EV Charging Station Logic
const chargingStations = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit the list of charging stations to the connected client
  socket.emit('chargingStations', chargingStations);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle a new EV charging station request
  socket.on('requestStation', (stationName) => {
    if (!chargingStations[stationName]) {
      chargingStations[stationName] = { status: 'Available' };
      io.emit('chargingStations', chargingStations);
    }
  });

  // Handle EV charging status updates
  socket.on('updateStatus', (data) => {
    const { stationName, status } = data;
    chargingStations[stationName].status = status;
    io.emit('chargingStations', chargingStations);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Basic test
describe('Simple Test', () => {
  it('should pass', () => {
    expect(true).to.equal(true);
  });
});

// You can add more tests as needed
