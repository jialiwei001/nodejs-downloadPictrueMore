let mongoose = require('mongoose');

let schema= mongoose.Schema({
    name :String ,
    age:Number,
    address:String,
    fav:[String]
})

module.exports=mongoose.model('user02',schema);