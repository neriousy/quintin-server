const express = require('express');
const session = require('express-session');
const cors = require('cors');
require("dotenv").config();
const cookieParser = require('cookie-parser')

const famlistRouter = require('./routes/Famlist');
const contactRounter = require('./routes/Contact');
const fameRouter = require('./routes/Fame');
const authRouter = require('./routes/Auth');
const db = require('./db');
const { prependListener } = require('./db');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3001',
  exposedHeaders: "set-cookie",
  credentials: true
};

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: "lax",
      secure: true,
    },
  }))
app.use(cors(corsOptions));




app.use('/api/famlist', famlistRouter);
app.use('/api/contact', contactRounter);
app.use('/api/fame', fameRouter);
app.use('/api/auth', authRouter);

app.post('/test', (req, res)=>{
  console.log(req.body);

  res.sendStatus(200);
});



app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);