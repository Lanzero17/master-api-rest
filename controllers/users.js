//Importar dependencias y modulos
//Importamos el modelo de usuarios
const User = require("../models/user");
const bcryp = require("bcrypt");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
//cargar el módulo 'fs' (file system) o sistema de archivos. Proporciona funciones para interactuar con el sistema de archivos del sistema operativo
const fs = require("fs");
const path = require("path");

//const mongoosePagination = require("mongoose-paginate-v2");


//importar jwt

const jwt = require("../services/jwt");
const { fileURLToPath } = require("url");

//importar servicio followServices
const followServices = require("../services/followServices");

const pruebaUser = (req, res) => {
    //console.log(req);
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
        const existingUsers = await User.findOne({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        });

        // console.log({"existingUsers ": existingUsers,
        // "existingUsers.length: ": existingUsers.length,
        // });

        // const users = await User.findOne({
        //     $or: [
        //       { nick: params.nick },
        //       { email: params.email }
        //     ]
        //   });

        // console.log("users: ",users);

        if (existingUsers) {
            return res.status(400).send({
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
            Error: error.message
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

const profile = async (req, res) => {

    //Realizamos algunas validaciones para el parametro id, después buscaremos los datos del usuario

    //Recibir el parametro del id de usuario por la url

    //En profile nos hace falta agregar dos propiedades, una para saber cuanto usuarios nos siguen  y otra para saber cuantos usuarios seguimos que los agregaremos cuando tengamos el controlador de follows


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

        //info de seguimiento

        console.log("usuario logueado: ",req.user.id);
        console.log("id del perfil del usuario: ", user_id);

        const followInfo = await followServices.followThisUser(req.user.id, user_id);

        //devolver resultado al cliente
        return res.status(200).json({
            status: "success",
            user: userProfile,
            following: followInfo.following, //-> si lo sigue el usuario logueado o identificado
            follower: followInfo.followers,  //-> si el usuario que envio por el body sigue al usuario identificado
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


//Metodo upload para subir el avatar del usuario logueado

const list = async (req, res) => {
    try {

        //Controlar en que pagina estamos
        //Creamos una variable page y le asignamos como parametro inicial 1 para indicar que la paginación por defecto sera la número 1
        let page = 1;

        //validamos si llega algún valor al parametro page a trávez de la url
        if (req.params.page) {
            // Si el paramertro page de la url no llega vacío, lo convertimos en un entero y se lo pasamos a la variable page que va a controlar la paginación de la aplicación
            //De esta manera ya voy a tener la pagina que estoy usando
            page = parseInt(req.params.page);
        }

        //Le indico a mi programa cuantos elementos por pagina quiero, por ejemplo si quiero 1 usuario por página
        let itemsPerPage = 5;


        /**
         * Opciones para la paginación y ordenamiento de los resultados.
         * @type {Object}
         * @property {number} page - Número de página actual.
         * @property {number} limit - Número máximo de elementos por página.
         * @property {string} sort - Campo utilizado para ordenar los resultados.
         */
        const options = {
            page,
            limit: itemsPerPage,
            sort: '_id'
        };

        //Hacer la consulta con moongose pagination

        //La variable result representa el resultado de la consulta paginada
        //esta contiene `docs` que es una propiedad que contiene los documentos y `total` que es una propiedad que representa el número total de documentos

        /**
         * Realiza la consulta de paginación de usuarios utilizando las opciones proporcionadas.
         * @param {Object} options - Opciones de paginación y ordenamiento de los resultados.
         * @returns {Promise<Object>} - Una promesa que se resuelve en un objeto con los resultados de la paginación.
         */
        const result = await User.paginate({}, options);
        console.log(result);

        //Luego, utilizando la desestructuración { docs: users, total } = result, 
        //asignamos los valores de docs y totalDocs a las variables users y total, respectivamente
        /**
         * Usuarios paginados.
         * @type {PaginatedUsers}
         */
        const { docs: users, totalDocs: total } = result;

        //console.log("Users:", users);
        //console.log("Total:", total);

        //Si users llega vacío o tiene longitud cero ingresa por if y retorna al cliente un status error

        /**
         * Verifica si hay usuarios disponibles en la consulta y envía una respuesta de error si no hay.
         * @param {Object} res - El objeto de respuesta HTTP.
         * @param {Array} users - Los usuarios obtenidos de la consulta.
         * @returns {Object} - Un objeto JSON con la respuesta de error.
         */
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
            pages: Math.ceil(total / itemsPerPage), // calcular el numero de paginas
            // averiguar como utilizar el boton de siguiente y anterior con base en esete codigo
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

const update = async (req, res) => {

    // pregunta
    // Buenas tardes, estaba viendo el video de la clase 67 del metodo uptade para la actualización de los datos de usuarios, me perdí un poco a partir de la creación de la variable let userIsset= false; , no fue muy claro para mi la razón por la cual se creo esta variable. Me gustaría a modo general recibir una explicación 

    //Recoger info del usuario a actualizar
    //Comprobar si el usuario ya existe, vamos a comprobar si el email o el nick ya existen y cortamos la ejecución
    //Buscar y actualizar el usuario con la nueva información

    //Recoger info del usuario a actualizar
    const UserIdentity = req.user; // en esta variable almaceno la información del usuario que se encuentra en el token 
    //Recojo la información de usuario que voy a actualizar y que me llega a travez del request en el body
    //userToUdate-->variable en la que recojo la información que quiero actualizar.
    let userToUdate = req.body;

    console.log("UserIdentity:", UserIdentity)

    //Eliminar campos sobrantes
    //NOTA: mirar como hacer una validación para decirle al cliente que estos campos no estan autorizados para eliminar
    // delete userToUdate.iat;
    // delete userToUdate.exp;
    // delete userToUdate.role;
    // delete userToUdate.image;

    //Si el cliente solicita actualizar estos campos, le dire que no esta autorizado para poder aplicar estos cambios
    if (userToUdate.iat || userToUdate.exp || userToUdate.role || userToUdate.image) {

        return res.status(400).json({
            status: "error",
            message: "No esta autorizado para actualizar los siguientes campos iat, exp, role o image ",
        });
    }

    try {

        //Comprobar si el usuario ya existe, vamos a comprobar si el email o el nick ya existen y cortamos la ejecución
        // existingUsers--> es la constante que va a almacenar un array de documentos que cumplan la condicion de tener el email y nick enviados en la request del cliente
        const existingUsers = await User.find({
            $or: [
                { email: userToUdate.email },
                { nick: userToUdate.nick }
            ]
        }).exec();
        // const existingUsers = await User.find({
        //     $or: [
        //         { email: userToUdate.email.toLowerCase() },
        //         { nick: userToUdate.nick.toLowerCase() }
        //     ]
        // }).exec();

        console.log("existingUsers: ", existingUsers);

        //userIsset --> es una variable de control 
        let userIsset = false;

        //userObj --> es la variable que recorre el foreach en el array existingUsers. userObj representa cada documento encontrado en el dominio existingUsers
        existingUsers.forEach(userObj => {
            //si existe un usuario que tenga ese email y nick y no es el usuario logueado
            //indica al cliente que ya existe un usuario con ese email y nick y no permita
            //colocar ese email y nick para el usuario logueado
            //pero si email y nick existen y son del usuario logueado no habria problema 
            //estamos validando si el id de userObj es el mismo del objeto logueado
            //si son el mismo me permite acutalizar, de lo contrario me dice que ya existe y no
            //me deja actualizar
            if (userObj && userObj._id != UserIdentity.id) userIsset = true;
            console.log("userIsset: ", userIsset);
        });

        // comprobar el email y el nick, que si son iguales al que envia el clietne, me permita acutalizar el objeto      

        if (userIsset) {
            return res.status(400).send({
                status: "success",
                messague: "El usuario ya existe"
            });
        }

        // if (existingUsers && existingUsers.length >= 1) {
        //     return res.status(200).send({
        //         status: "success",
        //         messague: "El usuario ya existe"
        //     });
        // }

        //Si me llega la pasword cifrarla
        //Buscar y actualizar el usuario con la nueva información
        //Comprobar si nos enviaron la contraseña y guardar de forma cifrada la nueva contraseña
        if (userToUdate.password) {

            let pwd = await bcryp.hash(userToUdate.password, 10); //Cifro la contraseña
            userToUdate.password = pwd; //asigno la contraseña cifrada
        }

        const updatedUser = await User.findByIdAndUpdate({_id:UserIdentity.id}, userToUdate, { new: true });

        console.log("updatedUser: ", updatedUser)

        if (!updatedUser) { //analizar
            return res.status(500).json({ status: "error", message: "Error al actualizar" });
        }

        // User.findByIdAndUpdate(UserIdentity.id, userToUdate, {new:true},(error, userToUdate)=>{

        //     if(erro || !userToUdate){
        //         return res.status(500).json({status:error, messaje: "Error al actualizar"})
        //     }

        //     return res.status(200).json({
        //         status: "succes",
        //         message: "metodo de actualizar usuario",
        //         userToUdate
        //     });
        // })

        return res.status(200).json({
            status: "success",
            message: "Método de actualizar usuario",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            error: error.message,
        });
    }


}

const upload = async (req, res) => {

    //Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "Petición no incluye la imagen"
        });
    }
    // Conseguir el nombre del archivo
    let image = req.file.originalname;
    // Sacar la extensión del archivo 
    const imageSplit = image.split("\.");
    const extencion = imageSplit[1];
    // Comprobar extensión
    if (extencion != "png" && extencion != "jpg" && extencion != "jpeg" && extencion != "gif") {

        // Si no es correcta, borrar el archivo
        //se recibe el path que va a ser eliminado
        const filePath = req.file.path;
        //Se elimina el path que fue almacenado previamente en el middleware con multer
        fs.unlinkSync(filePath);

        //Devolver respuesta negativa
        return res.status(400).send({
            stutus: "succes",
            message: "Extención del fichero invalida",
        });

    }
    // Si si es correcta, guardar la imagen en bbdd


    // Este condigo ha sido propuesto por chatGPT, y ha servidor como punto de partida para corregir el siguiente códico
    // try {

    //     console.log("Filtro de búsqueda:", { _id: req.user.id });

    // const userUpdated = await User.findOneAndUpdate(
    //     { _id: req.user.id },
    //     { image: req.file.filename },
    //     { new: true }
    // );

    //     console.log("userUpdated: ", userUpdated);

    //     if (!userUpdated) {
    //         return res.status(500).json({
    //             status: "error",
    //             message: "Error al actualizar el avatar"
    //         });
    //     }

    //     return res.status(200).send({
    //         status: "success",
    //         message: "Subida de imágenes",
    //         user: userUpdated,
    //         file: req.file
    //     });
    // } catch (error) {
    //     console.error("Error al actualizar el usuario:", error);
    //     return res.status(500).json({
    //         status: "error",
    //         message: "Error al actualizar el avatar"
    //     });
    // }


    try { ////---> codigo correjido.

        console.log("req.user.id: ", req.user.id);
        console.log("Filtro de búsqueda:", { _id: req.user.id });

        const userUpdated = await User.findOneAndUpdate(
            { _id: req.user.id }, // se recomienda hacer el filtro por {clave: valor} para asegurar que la busqueda se realice en función del campo indicado
            { image: req.file.filename },
            { new: true });

        console.log("userUpdated: ", userUpdated)

        if (!userUpdated) { //analizar
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar el avatar"
            });
        }
        // Devolver respuesta
        return res.status(200).send({
            stutus: "succes",
            message: "subida de imagenes",
            user: userUpdated, //devolvemos el objeto actualizado 
            file: req.file,
        });


    } catch {

        console.error("Error al actualizar el usuario:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar el avatar"
        });
        
    }
}

//Metodo para mostar el avatar 
const avatar = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;
    // Mostrar el path real de la imagen
    const filePath = "./uploads/avatars/" + file;
    // Comprobar que existe


    fs.stat(filePath, (error, exist) => {

        if (!exist) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen",
            })
        }

        return res.sendFile(path.resolve(filePath));

    });

    // // Devolver un file

    // return res.status(200).json({
    //     status: "succes",
    //     message: "metodo mostrar avatar",
    //     file: file,
    //     filePath: filePath,
    // });

}


module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar
}
