// middleware/auth.js

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
}

function permit(...allowedRoles) {
  return (req, res, next) => {
    const user = req.session.user;
    console.log('Role trong session:', user?.role);
    console.log('Roles được phép:', allowedRoles);
    if (user && allowedRoles.includes(user.role)) {
      return next();
    } else {
      return res.status(403).send('Access denied');
    }
  };
}

const isAdmin = permit('admin');
const isToTruong = permit('totruong');
const isToPho = permit('topho');
const isKeToan = permit('ketoan');

module.exports = {
  ensureAuthenticated,
  permit,
  isAdmin,
  isToTruong,
  isToPho,
  isKeToan
};
