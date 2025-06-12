const User = require('../models/User');
const bcrypt = require('bcrypt');

class AdminController {
  // Hiển thị dashboard
  async dashboard(req, res) {
    try {
const users = await User.find().select('username role').lean();
      console.log('Users:', users);

res.render('admin-dashboard', { users, user: req.session.user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi server');
    }
  }

  // Xóa user
  async deleteUser(req, res) {
  try {
    const userId = req.params.id;
    console.log('Xoá user ID:', userId);

    // Dùng req.session.user thay vì req.user
    if (req.session.user && req.session.user._id.toString() === userId) {
      return res.status(400).send('Không thể xoá chính bạn');
    }

    await User.findByIdAndDelete(userId);
    res.redirect('/admin/dashboard?successDelete=true');
  } catch (err) {
    console.error('Lỗi xoá user:', err);
    res.status(500).send('Lỗi xóa user');
  }
}

  async showCreateUserForm(req, res) {
  const success = req.query.success === 'true'; // kiểm tra query param
  res.render('admin-create-user', {
    success, // truyền vào view
    error: null
  });
}
  async createUser(req, res) {
  const { username, password, role } = req.body;

  try {
    const user = new User({
      username,
      password, // để nguyên, schema sẽ tự hash
      role
    });
    await user.save();
    res.redirect('/admin/users/create?success=true');
  } catch (err) {
    console.error('Lỗi tạo user:', err);
    res.render('admin-create-user', {
      error: 'Tạo tài khoản thất bại. Username có thể đã tồn tại hoặc dữ liệu không hợp lệ.'
    });
  }
}
}

module.exports = new AdminController();
