const bcrypt = require('bcrypt');
const User = require('../models/User');

class AuthController {
    showLogin(req, res) {
        res.render('login'); // form đăng nhập
    }

    async login(req, res, next) {
        try {
            console.log('Dữ liệu nhận được từ form:', req.body); // Thêm dòng này
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
                return res.render('login', { error: 'Sai tài khoản hoặc mật khẩu' });
            }
            console.log('Mật khẩu nhập:', password);
            console.log('Mật khẩu trong DB:', user.password);

            const match = await bcrypt.compare(password, user.password);
            
            console.log('So khớp mật khẩu:', match);
            if (!match) {
                return res.render('login', { error: 'Sai tài khoản hoặc mật khẩu' });
            }
            console.log('Form input:', req.body);

            // Lưu thông tin đăng nhập vào session
            req.session.user = {
                _id: user._id,
                username: user.username,
                role: user.role
            };
            console.log('Form input:', req.body);

            // Chuyển hướng theo role
            console.log('Role người dùng:', user.role);

            if (user.role === 'admin') return res.redirect('/admin/dashboard');
            if (user.role === 'totruong') return res.redirect('/citizen');
            if (user.role === 'topho') return res.redirect('/citizen');
            if (user.role === 'ketoan') return res.redirect('/fee');
        } catch (error) {
            next(error);
        }
    }

    
    logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Lỗi khi logout:', err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
}

}

module.exports = new AuthController();
