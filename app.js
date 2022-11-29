const express = require('express');
const cors = require('cors');
const famlistRouter = require('./routes/Famlist');
const contactRounter = require('./routes/Contact');

const app = express();
app.use(cors());

app.use('/famlist', famlistRouter);
app.use('/contact', contactRounter);

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);