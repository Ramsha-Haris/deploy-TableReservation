// Core Modules
const path = require('path');

// External Modules
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Local Modules
const rootDir = require('./utils/pathUtil');
const authRouter = require('./routes/authRouter');
const storeRouter = require('./routes/storeRouter');
const hostRouter = require('./routes/hostRouter');
const userRouter = require('./routes/userRouter');
const errorsController = require('./controllers/errors');
const { protect } = require('./middleware/authMiddleware');

// Environment Variables
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const PORT = process.env.PORT || 3000;

// Express App Setup
const app = express();

// View Engine (Optional if you're using API + React)
app.set('view engine', 'ejs');
app.set('views', 'views');

// CORS Setup
const allowedOrigins = [
  // 'https://bodies-winter-democracy-nam.trycloudflare.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Global Middleware
app.use(express.static(path.join(rootDir, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Public Routes
app.use('/api/auth', authRouter);

// Protected Routes
app.use('/api/store', protect, storeRouter);
app.use('/api/host', protect, hostRouter);
app.use('/api/user', protect, userRouter);

// Serve React Frontend (Built Vite Output)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// 404 Handler
app.use(errorsController.pageNotFound);

// Database Connection + Server Start
mongoose.connect(MONGO_DB_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
