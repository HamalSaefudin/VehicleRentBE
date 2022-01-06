const jwt = require('jsonwebtoken')

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if(token===null) return res.sendStatus(401);

    jwt.verify(token,process.env.SECRET_TOKEN,(err,user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next()
    })
}

function authenticateRole(role){
    return (req,res,next)=>{
        const permission = req.user.permission;
        const canAccess = role.permission.every(element => permission.includes(element))
        if(!canAccess){
            res.status(401);
            return res.send('Not Allowed');
        }

        next()
    }
}

module.exports = {
    authenticateToken,
    authenticateRole 
};