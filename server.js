const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { connectToDatabase } = require('./api/db');
const { User, Skill, Experience, Project } = require('./api/models');
const usersHandler = require('./api/users');
const portfolioHandler = require('./api/portfolio');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Seed initial primary admin user if none exists
async function seedDefaultUser() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial primary admin user (Vince Lawrence)...');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Vince Lawrence V. Baraclan',
        email: 'bvincelawrence@gmail.com',
        password: hashedPassword,
        role: 'admin',
        img: 'https://avatars.githubusercontent.com/u/158171645?v=4',
      });
      console.log('✅ Initial admin created: bvincelawrence@gmail.com / Admin@123');
    }
  } catch (err) {
    console.error('⚠️ Could not check/seed default user:', err.message);
  }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectToDatabase();
    res.json({
      status: 'ok',
      mongodb: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      mongodb: 'disconnected',
      error: err.message,
    });
  }
});

// Route handlers delegating to the serverless-compatible handlers
app.all('/api/users', (req, res) => usersHandler(req, res));
app.all('/api/users/:id', (req, res) => {
  req.query.id = req.params.id;
  return usersHandler(req, res);
});

app.all('/api/portfolio', (req, res) => portfolioHandler(req, res));
app.all('/api/portfolio/:type', (req, res) => {
  req.query.type = req.params.type;
  return portfolioHandler(req, res);
});
app.all('/api/portfolio/:type/:id', (req, res) => {
  req.query.type = req.params.type;
  req.query.id = req.params.id;
  return portfolioHandler(req, res);
});

// Start server
connectToDatabase()
  .then(async () => {
    await seedDefaultUser();
    app.listen(PORT, () => {
      console.log(`🚀 Baraclan.me API Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB on startup:', err.message);
    app.listen(PORT, () => {
      console.log(`⚠️ Server running on http://localhost:${PORT} (MongoDB offline)`);
    });
  });

