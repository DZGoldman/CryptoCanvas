require('dotenv').config({
    silent: true
  });
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const   Sequelize = require('sequelize'); 
// sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_ONYX_URL|| process.env.DATABASE_URL
const sequelize = new Sequelize( {
    dialect: 'postgres',
    port: process.env.PORT || 5432,
    username: process.env.username,
    password: null,
    database: process.env.database
  });
  

const Drawing = sequelize.import(__dirname + "/Models/Drawing")

sequelize.sync().then(function() {
    console.log('tables synced');
  }).catch(function() {
    console.log('table problems');
  })
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping',  (req, res) =>  {
 return res.send('pong');
});

app.get('/',  (req, res)=> {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);