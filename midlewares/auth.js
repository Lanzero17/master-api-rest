//importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

//importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//middleware de autenticación
exports.auth = (req, res, next) => {

    //comprobar si me llega la cabecera de autenticación
    if(!req.headers.authorization){
        return res.status(403).send({
            status:"error",
            message:"la petición no tiene la cabecera de autenticación",
        });
    }

    //Limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    //Decodificar el token
    try {
        let payload = jwt.decode(token, secret);

        //Comprobar expiración del token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status:"error",
                message:"Token expirado",
            });
        }


        //console.log("datos del payload:", payload);
        //console.log(req);

        //Agregar datos de usuario a request
        req.user = payload;
        
    } catch (error) {
        return res.status(403).send({
            status:"error",
            message:"Token invalido",
            error
        });
    }

    //Pasar a la ejecutación de la ruta
    next();
}