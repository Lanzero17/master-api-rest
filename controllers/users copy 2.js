//Importar dependencias y modulos
//Importamos el modelo de usuarios
const User = require("../models/user");
const bcryp = require("bcrypt");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//const mongoosePagination = require("mongoose-paginate-v2");


//importar jwt

const jwt = require("../services/jwt");


const pruebaUser = (req, res) => {
    return res.status(200).json({
        messague: "Mesan enviado desde: controllers/users.js",
        usuario: req.user
    });
}

//Metodo de registro
const register = async (req, res) => {

    let params = req.body;

    if (!params.name || !params.email || !params.password || !params.nick) {

        console.log("!Faltan datos por enviar");

        return res.status(400).json({
            messaje: "Faltan datos por enviar",
            status: "error"
        });
    }

    try {
        const existingUsers = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        }).exec();

        if (existingUsers && existingUsers.length >= 1) {
            return res.status(200).send({
                status: "success",
                messague: "El usuario ya existe"
            });
        }

        let pwd = await bcryp.hash(params.password, 10);

        params.password = pwd;

        let user_to_save = new User(params);

        let savedUser = await user_to_save.save();

        return res.status(200).json({
            messaje: "Acción de registro de usuarios",
            status: "success",
            user_to_save: savedUser
        });

    } catch (error) {
        console.error('Error al guardar el documento:', error);

        return res.status(500).json({
            status: "Error",
            messague: "Error en la consulta de usuarios",
        });
    }
}

//Metodo de login
const login = async (req, res) => {

    //Regoger parametros del body que me llegan por petición http
    const params = req.body;

    //Imprimo los parametros por consola para saber si me estan llegando datos, otra opción es retornarlos al cliente.
    console.log(params);


    //validar si me llegan los parametros email y password para comparar contra la información que esta en la base de datos
    if (!params.email || !params.password) {

        console.log("!Faltan datos por enviar");

        return res.status(400).json({
            messaje: "Faltan datos por enviar",
            status: "error"
        });
    }

    try {
        //Buscar el usuario en la base de datos con el email y las password recibidas.
        // const user = await User.findOne({ email: params.email }).select({ "password": 0 }).exec(); ---> codigo que genera error.

        //Buscar el usuario por su email
        const user = await User.findOne({ email: params.email }).exec();
        console.log("datos a validar en el if ", user);

        if (!user) {
            return res.status(400).json({
                messaje: "No existe el usuario",
                status: "error",
            });
        }

        //comprobar si la  contraseña es correcta
        //const pwd = bcryp.compareSync(params.password, user.password); ---> forma sincrona
        const pwd = await bcryp.compare(params.password, user.password); //---> forma asincrona, devuelve un valor booleano

        console.log(pwd);

        if (!pwd) {
            return res.status(400).json({
                messaje: "No te has identificado correctamente",
                status: "error",
            });
        }

        //devolver el token 
        const token = jwt.createToken(user);

        //Eliminar la password del objeto para no enviarla al cliente
        //cómo usar delete para eliminar la propiedad de un objeto???

        //devolver los datos del usuario que me interese enviarle al cliente
        return res.status(200).json({
            messaje: "te has identificado corretamente",
            status: "success",
            user: {
                id: user._id,
                name: user.name,
                nick: user.nick,
            },

            //El token nos va a servir para podernos identificar en la aplicación en cada momento
            token
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            messaje: "Error interno del servidor",
            status: "error", error
        });

    }

}

// |||||||||||||||||||||||
// ||   Metodo profile  ||
// |||||||||||||||||||||||

//Con este metodo vamos a poder sacar los datos del perfil de un usuario
//Estos datos nos sirven para hacer la página de perfil del usuario

/**
 * El metodo profile, devuelve la información del usuario consultado por su ID 
*/

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const profile = async (req, res) => {

    //Realizamos algunas validaciones para el parametro id, después buscaremos los datos del usuario

    //Recibir el parametro del id de usuario por la url

    //En profile nos hace falta agregar dos propiedades, una para saber cuanto usuarios nos siguen  y otra para saber cuantos usuarios seguimos que los agregaremos cuando tengamos el controlador de follows

    /**
     * @type {String} user_id recibe el ID solicitado por el cliente
     */
    const user_id = req.params.id;

    //validamos el parametro del id recibido por la url, si el parametro esta vacío ingresara por if


    if (!user_id) {
        //Si el parametro esta vacío se mostrará un mensaje por consola indicando que no se recibio el parametro id
        console.log("!No se recibio el parametro id");
        //Si el parametro id que recibí esta vacío, el sistema devuelve un mensaje al cliente indicando que no se recibio el parametro id y un satatus error
        return res.status(400).json({
            messaje: "!No se recibio el parametro id",
            status: "error"
        });
    }

    //Validamos si el id recibido es valido, esta validación la realizamos con el metodo "idObjectId.isValid" para verificar si un valor dado es un ID válido en formato de ObjectI
    if (!ObjectId.isValid(user_id)) {
        console.log('El ID del usuario no es válido, debe contener 24 caracteres hexadecimales. Si el valor es un número entero, debe ser menor que 2^32, Estos 24 caracteres hexadecimales deben corresponder a los dígitos del 0 al 9 y las letras minúsculas de la "a" a la "f"');
        return res.status(400).json({
            messaje: "El ID del usuario no es válido, debe contener 24 caracteres hexadecimales. Si el valor es un número entero, debe ser menor que 2^32, Estos 24 caracteres hexadecimales deben corresponder a los dígitos del 0 al 9 y las letras minúsculas de la 'a a la 'f'",
            status: "error"
        });
    }

    //Si las valiciones anteriores son superadas, a continuación se realizara la 
    //Busqueda del usuario en la base de datos.

    try {
        //Buscar el usuario en la base de datos con el id
        //console.log("Id a validar: " + new ObjectId(user_id));
        const userProfile = await User.findOne({ _id: user_id })
            .select({ password: 0, role: 0 }) // omitir estos datos al cliente
            .exec();

        // El siguiente console es para propositos del desarrollador
        // Se puede validar la información que esta llegando de la base de datos
        // y que va a ser validada en el siguiente if
        console.log("datos a validar en el if ", userProfile);

        //Si la busqueda del usuario no dio resultados, el programa entrara por if
        if (!userProfile) {
            //Se devuelve la respuesta al usuario indicando que el perfil con ese id
            // no existe en la base de datos
            return res.status(400).json({
                messaje: "el usuario " + user_id + " no exite",
                status: "error",
            });
        }

        //devolver resultado al cliente
        return res.status(200).json({
            status: "success",
            user: userProfile,
        });

    } catch (error) {
        //Devolver el resultado
        console.log(error);
        return res.status(500).json({
            messaje: "Error interno del servidor",
            status: "error:", error
        });

    }

}

//Metodo de listado de usuarios
// const list = async (req, res) => {
//     //controlar en quá página estamos
//     let page = 1;
//     if (req.params.page) {
//         page = req.params.page;
//     }

//     page = parseInt(page);
//     //consulta con mongoose pagination
//     let itemsPerPage = 5;

//     try {
//         const users = await User.find().sort('_id');
//         return res.status(200).json({
//             status: "success",
//             users,
//         });
//     } catch (error) {
//         return res.status(404).json({
//             Message: "no hay usuarios disponibles",
//             status: "success",
//             error,
//         });
//     }


//     // // User.find().sort('_id').paginate(page,itemsPerPage,(error,users, total)=>{
//     // User.find().sort('_id').paginate(page,itemsPerPage,(error,users, total)=>{

//     //     if(error || !users){
//     //         return res.status(404).json({
//     //             Message: "no hay usuarios disponibles",
//     //             status: "success",
//     //             error
//     //         });
//     //     }

//     //     //devolver el resultado( posteriormente info follow)
//     //     return res.status(200).json({
//     //         status: "success",
//     //         users,
//     //         page,
//     //         itemsPerPage,
//     //         total,
//     //         pages: false
//     //     });

//     // });

// }

// const list = (req, res) => {

//     //Controlar en que pagina estamos
//     let page = 1;
//     if (req.params.page) {
//         //De esta manera ya voy a tener la pagina que estoy usando
//         page = req.params.page
//     }
//     page = parseInt(page);
//     //Hacer la consulta con moongose pagination

//     /**
//      * Le indico a mi programa cuantos elementos por pagina quiero, por ejemplo si quiero 5 usuarios por pagina
//      */
//     let itemsPerPage = 5

//     // con find() saco todos los usuarios
//     // con sort ordeno la consulta
//     // paginate(page,itemsPerPage,(error, users, total)=> {}  pasamos la pagina actual, el numero de items por pagina, y una funcion de callback 
//     // error -> un posible error
//     // users -> los usuarios que va a sacar
//     // total -> el total de registros que ha sacado o total de elementos que encuentra la consulta
//     User.find().sort('_id').paginate(page,itemsPerPage,(error, users, total)=> {

//         if(error || !users){
//         return res.status(404).json({
//             status: "error",
//             Message: "error en la consulta, no hay usuarios disponibles",
//             Error: error.message,
//         });
//         }

//         //Devolver el resultado (posteriormente info de follows)

//         return res.status(200).json({
//             status: "success",
//             users,
//             page,
//             itemsPerPage,
//             total,
//             pages: false,
//         });

//     });

// }


//Metodo de listado de usuarios
const list = async (req, res) => {
    try {

        //Controlar en que pagina estamos
        //Asignamos una variable page y le asignamos como parametro inicial 1 para indicar que la paginación por defecto sera la número 1
        let page = 1;

        //validamos si llega algún valor al parametro page a trávez de la url
        if (req.params.page) {
            // Si el paramertro page no llega vacío lo convertimos en un entero y se lo pasamos a la variable page que va a controlar la paginación de la aplicación
            //De esta manera ya voy a tener la pagina que estoy usando
            page = parseInt(req.params.page);
        }

        //Le indico a mi programa cuantos elementos por pagina quiero, por ejemplo si quiero 1 usuario por página
        let itemsPerPage = 2;


        /**
         * opciones de la paginación.
         * @param {number} page - El número de página actual.
         * @param {number} itemsPerPage - El número de elementos por página.
         * @param {number} sort - El id de usuarios.
         */
        const options = {
            page,
            limit: itemsPerPage,
            sort: '_id'
        };

        //Hacer la consulta con moongose pagination

        //La variable result representa el resultado de la consulta paginada
        //esta contiene `docs` que es una propiedad que contiene los documentos y `total` que es una propiedad que representa el número total de documentos
        const result = await User.paginate({}, options);
        console.log(result);

        //Luego, utilizando la desestructuración { docs: users, total } = result, asignamos los valores de docs y total a las variables users y total, respectivamente
        const { docs: users, total } = result;

        //console.log("Users:", users);
        //console.log("Total:", total);

        //Si users llega vacío o tiene longitud cero ingresa por if y retorna al cliente un status error
        if (!users || users.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Error en la consulta, no hay usuarios disponibles",
            });
        }

        //Si la consulta a pasado las validaciones, devuelve un status 200 ok al clientes la información que devolvemos en formato JSON

        /**
         * Envia una respuesta JSON con el estado 200.
         * @param {Object} res - El objeto de respuesta HTTP.
         * @param {string} status - El estado de la respuesta.
         * @param {Array} users - Los usuarios a enviar en la respuesta.
         * @param {number} page - El número de página actual.
         * @param {number} itemsPerPage - El número de elementos por página.
         * @param {number} total - El número total de usuarios.
         * @returns {Object} - Un objeto JSON con la respuesta.
         */
        return res.status(200).json({
            status: "success",
            users,
            page,
            itemsPerPage,
            total,
            pages: false,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            error: error.message,
        });
    }
};



module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list
}
