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
  
// const rp = require('request-promise');
// rp.get({
//     json: true,
//     uri:`https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=389224&toBlock=latest&address=0x33990122638b9132ca29c723bdf037f1a891a70c&topic0=0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545&apikey=${process.env.etherscan_key}`
// }) .then(function (data) {
//     console.log('Result',  data.result[0]);
// })
// .catch(function (err) {
//     // API call failed...
//     console.log(err)
// });


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