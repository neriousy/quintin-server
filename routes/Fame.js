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
    return; 
  }catch{
    res.status(404).send('Not found');
    return;
  }
});

fameRouter.get('/', async (req, res)=>{
  const query = 'SELECT `fame`.`id`, `fame`.`fame`, `famlist`.`nick`, `famlist`.`class` from `fame` INNER JOIN famlist ON `fame`.`id` = `famlist`.`id` WHERE `famlist`.`isHidden` = 0 ORDER BY `fame`.`fame` DESC;';
  const results = await db.promise().query(query);
  res.status(200).send(results[0]);
});

fameRouter.get('/progress/:year/:month', async(req, res)=>{
  const date = new Date();
  let prevTable;

  try{
    const currentMonth = parseInt(req.params.month);
    const currentYear = parseInt(req.params.year);
    let query;

    let prevMonth = currentMonth + 1;
    let prevYear = currentYear;
  
    if(currentMonth == date.getMonth() + 1 && currentYear == date.getFullYear()){
      prevTable = `fame_${currentMonth}_${currentYear}`;

      query = `SELECT famlist.id, famlist.nick, famlist.class, fame.fame as currentFame, ${prevTable}.fame as prevFame, (fame.fame - ${prevTable}.fame) as diff from famlist INNER JOIN fame on fame.id = famlist.id INNER JOIN ${prevTable} on ${prevTable}.id = famlist.id ORDER BY diff DESC;`;

      const results = await db.promise().query(query);
      res.status(200).send(results[0]);
      return;
    }

    if(currentMonth == 1){
      prevMonth = 12;
      prevYear = currentYear - 1;
    }

    const currentTable = `fame_${currentMonth}_${currentYear}`;
    prevTable = `fame_${prevMonth}_${prevYear}`;

    query = `SELECT famlist.id, famlist.nick, famlist.class, ${prevTable}.fame as currentFame, ${currentTable}.fame as prevFame,  (${prevTable}.fame - ${currentTable}.fame) as diff from famlist INNER JOIN ${currentTable} ON ${currentTable}.id = famlist.id INNER JOIN ${prevTable} on ${prevTable}.id = famlist.id ORDER BY diff DESC`;
    
    const results = await db.promise().query(query);
    res.status(200).send(results[0]);
    return ;
  }catch{
    res.status(404).send('Not found');
    return;
  }
});


fameRouter.get('/list', async(req, res) =>{
  const query = 'SELECT id, table_name, month_year from fame_list ORDER by id DESC LIMIT 2';
  const results = await db.promise().query(query);
  res.status(200).send(results[0]);
});

module.exports = fameRouter;