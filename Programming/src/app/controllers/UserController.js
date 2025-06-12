const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserController {
  showChangeInfoForm(req, res) {
    // Dùng req.session.user vì bạn lưu user trong session
    const user = req.session.user;
    res.render('change-info', { user, error: null, success: null });
  }

  async changeInfo(req, res) {
    try {
      const { username, currentPassword, newPassword } = req.body;
      const userId = req.session.user._id;  // lấy id từ session
      const user = await User.findById(userId);

      if (!username) {
        return res.render('change-info', { user: req.session.user, error: 'Username không được để trống', success: null });
      }

      // Kiểm tra username có thay đổi không, nếu thay đổi thì kiểm tra trùng
      if (username !== user.username) {
        const exists = await User.findOne({ username });
        if (exists) {
          return res.render('change-info', { user: req.session.user, error: 'Username đã tồn tại', success: null });
        }
      }

      // Nếu người dùng muốn đổi mật khẩu
      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          return res.render('change-info', { user: req.session.user, error: 'Phải nhập cả mật khẩu hiện tại và mật khẩu mới để đổi mật khẩu', success: null });
        }

        // Kiểm tra mật khẩu hiện tại đúng không
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
          return res.render('change-info', { user: req.session.user, error: 'Mật khẩu hiện tại không đúng', success: null });
        }

        // Hash mật khẩu mới
        const saltRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);
      }

      // Cập nhật username (nếu thay đổi)
      user.username = username;
      await user.save();

      // Cập nhật session user mới nhất để hiển thị đúng
      req.session.user.username = username;

      res.render('change-info', { user: req.session.user, error: null, success: 'Cập nhật thông tin thành công' });
    } catch (err) {
      console.error(err);
      res.render('change-info', { user: req.session.user, error: 'Lỗi server', success: null });
    }
  }
}

module.exports = new UserController();
