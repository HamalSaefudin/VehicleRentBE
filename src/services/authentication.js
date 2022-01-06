const Roles = require('../models/roles')
const User = require('../models/user');
const RefreshToken = require('../models/refresh-token');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
const crypto= require('crypto');


function generateToken(user){
    return jwt.sign(user,process.env.SECRET_TOKEN, { expiresIn: '50m' })
}

async function generateRefreshToken(userId){
    return new RefreshToken({
        userId : userId,
        token : generateRandomToken(),
        expires : new Date(Date.now()+6*60*1000)
    });
}

function generateRandomToken(){
    return crypto.randomBytes(40).toString('hex')
}

async function getRefreshToken(token){
    const refreshTokenIsExist = await RefreshToken.findOne({token});
    if(!refreshTokenIsExist||!refreshTokenIsExist.isActive) throw new Error('Token invalid');
    return new RefreshToken(refreshTokenIsExist);
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.loginServices =async({username,password})=>{
    const keyQuery = validateEmail(username)?'email':'username';
    
    const user = await User.findOne({[keyQuery]:username})

    const isPasswordSame = await bcrypt.compare(password,user.password)
    
    if(!user || !isPasswordSame){
        throw new Error('Email or password incorrect')
    }
    const payloadGenerateToken = {
        username:user.username,
        userId:user._id,
        email:user.email
    }

    const token = generateToken(payloadGenerateToken)
    const refreshToken = await generateRefreshToken(user._id)
    await refreshToken.save()
    return {accessToken:token,refreshToken:refreshToken.token}
}

exports.refreshTokenServices = async(req)=>{
    const {refreshToken} = req.params;
    const {userId,roles,username,permission,email} = jwt.decode(req.body.token)

    const oldRefreshToken = await getRefreshToken(refreshToken);
    const user = await User.findOne({userId});
    if(!user) throw new Error('Token invalid')
    await oldRefreshToken.remove()

    const newRefreshToken = await generateRefreshToken(userId)
    const payloadGenerateToken = {
        username,
        roles,
        permission,
        email
    }
    const newToken = generateToken(payloadGenerateToken)
    
    return {
        accessToken:newToken,
        refreshToken:newRefreshToken.token
    }
}

exports.initialChangePasswordServices = async(req)=>{
    const {userId} = req.user;
    const {newPassword} = req.body;
    const user = await User.findById(userId);
    if(user.password !== '-') return;
    user.password = await bcrypt.hash(newPassword,process.env.SALT);
    await user.save()
}

exports.revokeToken = async(req)=>{
    const {refreshToken} = req.params
    const _token = await getRefreshToken(refreshToken)
    await _token.remove()
}