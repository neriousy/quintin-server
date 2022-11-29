const { Router } = require('express');
const db = require('../db');

const famlistRouter = Router();

famlistRouter.get('/', async(req, res) =>{
  const results = await db.promise().query("SELECT * from famlist WHERE isHidden = 0 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC");
  res.status(200).send(results[0]);
});


famlistRouter.get('/warriors', async (req, res) =>{
  const results = await db.promise().query("SELECT * from famlist WHERE class = 1 AND isHidden = 0 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC");
  res.status(200).send(results[0]);
})

famlistRouter.get('/archers', async (req, res) =>{
  const results = await db.promise().query("SELECT * from famlist WHERE class = 2 AND isHidden = 0 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC");
  res.status(200).send(results[0]);
});

famlistRouter.get('/mages', async (req, res) =>{
  const results = await db.promise().query("SELECT * from famlist WHERE class = 3 AND isHidden = 0 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC");
  res.status(200).send(results[0]);
});

famlistRouter.get('/martialartists', async (req, res) =>{
  const results = await db.promise().query("SELECT * from famlist WHERE class = 4 AND isHidden = 0 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC");
  res.status(200).send(results[0]);
});


module.exports = famlistRouter;