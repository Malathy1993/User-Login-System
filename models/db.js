var mongoose = require('mongoose')
var url = "mongodb://localhost:27017/nodeauth";

// connect method of mongoose
mongoose.connect(url,{useNewUrlParser:true},(err)=>{
    if(!err){
        console.log("MongoDB Connection is successful");  
    }else{
        console.log("An error occured in connecting mongodb" +err);
        
    }
})