const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/', async (req, res) =>{
  const results = await db.promise().query("SELECT * from famlist");
  res.status(200).send(results[0]);
});

router.get('/warriors', async (req, res) =>{
  const results = await db.promise().query("SELECT * from famlist WHERE class = 1 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC");
  res.status(200).send(results[0]);
})

router.get('/archers', async (req, res) =>{
  const results = await db.promise().query("SELECT * from famlist WHERE class = 2 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC");
  res.status(200).send(results[0]);
})

router.get('/mages', async (req, res) =>{
  const results = await db.promise().query("SELECT * from famlist WHERE class = 3 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC");
  res.status(200).send(results[0]);
})

router.get('/martialartists', async (req, res) =>{
  const results = await db.promise().query("SELECT * from famlist WHERE class = 4 ORDER BY lvlaw DESC, lvl DESC, pos ASC, nick ASC");
  res.status(200).send(results[0]);
})


module.exports = router;