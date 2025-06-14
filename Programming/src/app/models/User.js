const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const User = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'totruong', 'topho', 'ketoan'], required: true }
});

// Hash password trước khi lưu
User.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Hàm so sánh mật khẩu
User.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};












































































































































































































module.exports = mongoose.model('User', User);
