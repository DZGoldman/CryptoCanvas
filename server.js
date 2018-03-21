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
    port: process.env.PORT  || 5433,
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

// root delivery inactive
app.use(express.static(path.join(__dirname, 'build_webpack')));

app.get('/ping',  (req, res) =>  {
  console.log('ping pong test')
 return res.json('pong');
});

app.post('/save',  (req, res) =>  {
  const newDrawing = Drawing.build()


});

app.get('/',  (req, res)=> {
  console.log('DELIVERTING ROOT')
  res.sendFile(path.join(__dirname, 'build_webpack', 'index.html'));
});
// NOTE: Double check this when hosting 
// app.listen( 8080);
app.listen( process.env.NODE_ENV ? process.env.PORT : 8080);
