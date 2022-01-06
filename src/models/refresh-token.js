const mongoose = require('mongoose');

function getIsExpired(){
    return Date.now() >= this.expires
}

function getIsActive(){
    return !this.revoked && !this.isExpired
}

const refreshTokenSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true,
    },
    expires:{
        type:Date,
        required:true,
    },
    revoked:{
        type:Date,
    },
    replacedByToken:{
        type:String,
    },
    isExpired:{
        type:Boolean,
        get: getIsExpired
    },
    isActive:{
        type:Boolean,
        get:getIsActive
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Refresh-Token',refreshTokenSchema)