const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const port = 3001;
const methodOverride = require('method-override');
const route = require('./routes');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const db = require('./config/db');
//connect db
db.connect();
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
const { engine } = require('express-handlebars');

app.use(session({
    secret: 'your_secret_key', // nên dùng biến môi trường
    resave: false,
    saveUninitialized: false,
    cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    secure: false,
    sameSite: 'lax'
  }

}));
//http logger
app.use(morgan('combined'));
//template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'resources/views/partials'),
    helpers: {
      eq: (a, b) => a === b,
      formatDate: function(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`; // Chuẩn YYYY-MM-DD
},
      year: () => new Date().getFullYear() // thêm helper tại đây

    }
  })
);


app.use(methodOverride('_method'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));
console.log('Path: ', path.join(__dirname, 'resources', 'views'));
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // hoặc req.user nếu bạn vẫn giữ nó
  next();
});
//route function
//route inits
route(app);

//127.0.0.1 - localhost
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
