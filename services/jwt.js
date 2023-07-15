//importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

//clave secreta para genera el token
const secret = "CLAVE_SECRETA_del_proyecto_de_la_RED_SOCIAL_9879879";
//Crear una funcion para generar tokens
const createToken = (user) =>{
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role:user.role,
        image:user.image,
        iat:moment().unix(),
        exp:moment().add(30,"days").unix()
        
    }
    
    console.log("iat: " + payload.iat +" exp: " + payload.exp);

    //Devolver jwt token codificado
    return jwt.encode(payload,secret);
}

module.exports = {
    secret,
    createToken
}