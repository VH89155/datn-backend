const mongoose = require('mongoose'); 
mongoose.set('strictQuery', true)
async function connect(){
    try {
        await mongoose.connect("mongodb://localhost:27017/DATN_Moive",{
        
        
        });
        console.log("Connected to mongodb");
      } catch (error) {
       
        console.log("failed to connect to mongodb",error);
      }
}

// module.exports = {connect};


function newConnection(uri){
  const conn = mongoose.createConnection(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  conn.on("connected", function(){
    console.log(`Connected: ${this.name} `) ;
  });
  conn.on("disconnected", function(){
    console.log(`Disconnected: ${this.name} `) ;
  });
  conn.on("err", function(){
    console.log(`MonngoDB :: connection: ${this.name} ${JSON.stringify(error)} `) ;
  });
return conn;
}

const DATN_MoiveConn = newConnection("mongodb://localhost:27017/DATN_Moive")

module.exports={
  DATN_MoiveConn,
  connect
}