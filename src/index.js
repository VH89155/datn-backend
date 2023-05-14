
const express = require('express');
const route= require('./routes/index');
const db= require('./config/db');
const cors = require('cors');
const app = express();

// connect to DB
db.connect();
require("dotenv").config({path:'.env'});
app.use(cors({
  origin:[ 'http://localhost:3000'],
  
}));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());


route(app);

app.listen(process.env.PORT),(
    console.log(`App listening at  http://localhost:${process.env.PORT}`)
);





