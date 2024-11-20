const jwt = require('jsonwebtoken');
const jwtMiddleware = (req,res,next)=>{
    try{
        const token = req.headers['authorization'].split(' ')[1];
        console.log('token',token);
        const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
        console.log(jwtResponse);
        req.payload = jwtResponse.userId;
        next()
    }
    catch(error){
        res.status(401).json('authorization failed please login')
    }
}
module.exports = jwtMiddleware;