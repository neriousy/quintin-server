const express = require('express');
const cors = require('cors');
const famlistRouter = require('./routes/Famlist');
const contactRounter = require('./routes/Contact');
const fameRouter = require('./routes/Fame');

const app = express();
app.use(cors());

app.use('/api/famlist', famlistRouter);
app.use('/api/contact', contactRounter);
app.use('/api/fame', fameRouter);

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);