
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for dev
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

const path = require('path');

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Delify API is running');
  });
}

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join_user_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

