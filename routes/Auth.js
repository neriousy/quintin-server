const { Router } = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const authRouter = Router();
const bcrypt = require('bcrypt');



function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}


function authenticate(req, res, next){
  const token = req.cookies.accessToken;
  if(token === null) { return res.sendStatus(401);}

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if(err) {return res.sendStatus(403);}

    req.id = user.id;
    next();
  })
};

// authRouter.get('/users', authenticate, (req, res) =>{
//   const users = [{ id: 1, name: 'Adam' }];

//   res.send(users);
// }); 



authRouter.post('/refresh', async (req, res) =>{
  const refreshToken = req.body.token;

  if(!refreshToken){
    return res.status(401);
  }

  try{
    await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  }catch (err){
    return res.send(403);
  }

  const accessToken = jwt.sign( {id: 1 }, process.env.TOKEN_SECRET, {expiresIn: 86400 })

  res.send(accessToken);
  
});



authRouter.post('/register', async(req, res) =>{

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let query = `INSERT INTO users(login, password) VALUES ('${req.body.login}', '${hashedPassword}')`;
    
    const result = await db.promise().query(query);
    
    console.log(result);

    res.sendStatus(201);

});


authRouter.post('/login', async(req, res) =>{

  const dateNow = new Date();
  let results = await db.promise().query(`SELECT * FROM users WHERE login = '${req.body.login}'`);

  const currentDate = formatDate(dateNow);
  dateNow.setDate(dateNow.getDate() + 10);
  const accessTokenExpireDate = formatDate(dateNow);
  dateNow.setDate(dateNow.getDate() + 50);
  const refreshTokenExpireDate = formatDate(dateNow);


  try
  {
    const hashedPassword = results[0][0]['password'];
    if(await bcrypt.compare(req.body.password, hashedPassword))
    {
      const accessToken = jwt.sign({ id: results[0][0]['id'] }, process.env.TOKEN_SECRET, { expiresIn: "10 days" });
      const refreshToken = jwt.sign({ id : results[0][0]['id']  }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "10 days" });


      try{
        let query = `INSERT INTO access_tokens VALUES('${accessToken}', ${parseInt(results[0][0]['id'])}, '${currentDate}', '${accessTokenExpireDate}')`;
        results = await db.promise().query(query);

        query = `INSERT INTO refresh_tokens VALUES ('${refreshToken}', '${accessToken}', '${refreshTokenExpireDate}')`;
        results = await db.promise().query(query);
      }catch(err){
        console.log(err);
      }
      

      res.cookie('accessToken', accessToken, {
        maxAge: 24 * 60 * 60 * 1000 * 10,
        httpOnly: false,
      });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 24 * 60 * 60 * 1000 * 60,
      });


      if(results !== null){
        res.status(200).send('Logged in');
      }else{
        res.status(500).send('ups');
      }

      
    }else
    {
      res.status(401).send('Niepoprawne dane');
    }
  }
  catch
  {
    res.status(401).send('Lol');
  }
  // save in DB

 

});


authRouter.post('/logwithcookie',authenticate, async(req, res) => {
  const id = await db.promise().query(`SELECT * from users WHERE id = ${req.id}`);
  res.status(200).send(id[0][0]);
})

module.exports = authRouter;