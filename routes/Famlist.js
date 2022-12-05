const { Router } = require('express');
const db = require('../db');

const famlistRouter = Router();

famlistRouter.get('/', async(req, res) =>{
  const query = "SELECT * from famlist WHERE isHidden = 0 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC";
  const results = await db.promise().query(query);
  res.status(200).send(results[0]);
});


module.exports = famlistRouter;