const bcrypt = require('bcrypt');
const { connectToDatabase } = require('./db');
const { User } = require('./models');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    const { id } = req.query || {};

    switch (req.method) {
      case 'GET': {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: users });
      }

      case 'POST': {
        const { email, password, name, role, img } = req.body;
        if (!email || !password) {
          return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
          return res.status(409).json({ success: false, message: 'Account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          email: email.toLowerCase(),
          password: hashedPassword,
          name: name || '',
          role: role || 'user',
          img: img || '',
        });

        const safeUser = newUser.toObject();
        delete safeUser.password;
        return res.status(201).json({ success: true, data: safeUser });
      }

      case 'PUT': {
        const targetId = id || req.body._id;
        if (!targetId) {
          return res.status(400).json({ success: false, message: 'User ID is required for update' });
        }

        const updateData = { ...req.body };
        delete updateData._id;

        // If password is being updated, hash it
        if (updateData.password && updateData.password.trim() !== '') {
          updateData.password = await bcrypt.hash(updateData.password, 10);
        } else {
          delete updateData.password;
        }

        const updated = await User.findByIdAndUpdate(targetId, updateData, { new: true }).select('-password');
        if (!updated) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, data: updated });
      }

      case 'DELETE': {
        const targetId = id || req.body._id;
        if (!targetId) {
          return res.status(400).json({ success: false, message: 'User ID is required for deletion' });
        }

        const deleted = await User.findByIdAndDelete(targetId);
        if (!deleted) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'User deleted successfully' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API /users Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

