const { Router } = require('express');
const db = require('../db');

const contactRounter = Router();

contactRounter.get('/', async (req, res)=>{
  const query = 'SELECT id, nick, pos from famlist WHERE (pos = 1 OR pos = 2 OR pos = 3) AND isHidden = 0 ORDER BY pos ASC';
  const results = await db.promise().query(query);
  res.status(200).send(results[0]);
});

module.exports = contactRounter;