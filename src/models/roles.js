const mongoose = require('mongoose');

const rolesSchema = mongoose.Schema({
    rolesId:{
        type:Number,
        required:true,
        unique:true,
        dropDups:true
    },
    name:{
        type:String,
        required:true
    },
    permission:[{
        type:String,
        required:true
    }]
},{
    timestamps:true
})

module.exports = mongoose.model('Roles',rolesSchema)