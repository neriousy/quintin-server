const express = require('express');
const cors = require('cors');
const famlistRouter = require('./routes/famlistApi');

const app = express();
app.use(cors());

app.use('/famlistApi', famlistRouter);

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);