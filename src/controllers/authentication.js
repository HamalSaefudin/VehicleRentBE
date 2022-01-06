const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const { loginServices, refreshTokenServices, googleLoginServices, initialChangePasswordServices } = require('../services/authentication');



exports.login =async(req,res,next)=> {
    try{
        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
        validateRequest(req,next,schema);
        const result = await loginServices(req.body);
        res.json(result)
    }catch(e){
        next(e)
    }
}

exports.refreshToken=async(req,res,next)=>{
    try{
        const schema = Joi.object.keys({
            refreshToken: Joi.string().required(),
            token: Joi.string().required()
        })
        validateRequest(req,next,schema);

        const result = await refreshTokenServices(req)
        res.json(result)
    }catch(e){
        next(e)
    }
}


exports.initialChangePassword = async(req,res,next)=>{
    try {
        await initialChangePasswordServices(req);
        res.status(200).json({message:"Password successfully changed"})
    } catch (error) {
        next(error)
    }
}