
const express = require('express');
const route= require('./routes/index');
const db= require('./config/db');
const cors = require('cors');
const app = express();

// connect to DB
db.connect();
require("dotenv").config({path:'.env'});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

 app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
route(app);

app.listen(process.env.PORT),(
    console.log(`App listening at  http://localhost:${process.env.PORT}`)
);





