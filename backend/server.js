require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/canteen', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};

connectDB();

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String
});

const User = mongoose.model('users', UserSchema, "users");


app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const test = await User.find();
    console.log(test)
    const user = await User.findOne({ username, role });
    // const user = await User.findOne({ username, role });
    console.log(user)
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (role !== user.role) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
