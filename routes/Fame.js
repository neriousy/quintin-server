const e = require('express');
const { Router } = require('express');
const db = require('../db');

const fameRouter = Router();

const date = new Date();

fameRouter.get('/:year/:month', async (req, res)=>{
  const currentMonth = parseInt(req.params.month);
  const currentYear = parseInt(req.params.year);
  try{
    const currentTable = `fame_${currentMonth}_${currentYear}`;
    const query = `SELECT + ${currentTable}.id, ${currentTable}.fame FROM ${currentTable}`;
    const results = await db.promise().query(query);
    res.status(200).send(results[0]);
  }catch{
    res.status(404).send('Not found');
  }
});

fameRouter.get('/', async (req, res)=>{
  const query = 'SELECT `fame`.`id`, `fame`.`fame`, `famlist`.`nick` from `fame` INNER JOIN famlist ON `fame`.`id` = `famlist`.`id` WHERE `famlist`.`isHidden` = 0;';
  const results = await db.promise().query(query);
  res.status(200).send(results[0]);
});

fameRouter.get('/progress/:year/:month', async(req, res)=>{
  const currentMonth = parseInt(req.params.month);
  const currentYear = parseInt(req.params.year);
  
  try{
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
  
    if(currentMonth == 1){
      prevMonth = 12;
      prevYear = currentYear - 1;
    }

    const currentTable = `fame_${currentMonth}_${currentYear}`;
    const prevTable = `fame_${prevMonth}_${prevYear}`;

    const query = `SELECT famlist.id, famlist.nick, famlist.class, ${currentTable}.fame as currentFame, ${prevTable}.fame as prevFame,  (${currentTable}.fame - ${prevTable}.fame) as diff from famlist INNER JOIN ${currentTable} ON ${currentTable}.id = famlist.id INNER JOIN ${prevTable} on ${prevTable}.id = famlist.id`;
    
    const results = await db.promise().query(query);
    res.status(200).send(results[0]);
  }catch{
    res.status(404).send('Not found');
  }

});


module.exports = fameRouter;