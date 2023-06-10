
const express = require('express');
const route= require('./routes/index');
const db= require('./config/db');
const cors = require('cors');
const app = express();

// connect to DB
db.connect();
require("dotenv").config({path:'.env'})
// app.use(cors({
//   origin: 'https://vh89155.github.io/dant-frontend/', // Chỉ cho phép truy cập từ domain này
//   methods: ['GET', 'POST',''], // Chỉ cho phép sử dụng các phương thức GET và POST
//   credentials: true // Cho phép chuyển thông tin xác thực
// }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(function(req, res, next) { res.setHeader("Access-Control-Allow-Origin", "https://vh89155.github.io"); next(); });




app.use(express.json());


route(app);

app.listen(process.env.PORT),(
    console.log(`App listening at  http://localhost:${process.env.PORT}`)
);





