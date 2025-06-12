const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/app/models/User'); // Đường dẫn tùy theo vị trí file model User

async function createAdmin() {
  await mongoose.connect('mongodb://localhost/BlueMoon', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log('Admin đã tồn tại');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('admin123', 10); // Có thể đổi mật khẩu tại đây

  const admin = new User({
    username: 'admin',
    password: 'admin123', // Mật khẩu gốc, sẽ được hash
    role: 'admin',
  });

  await admin.save();
  console.log('Tạo admin thành công');
  process.exit();
}

createAdmin().catch(console.error);
