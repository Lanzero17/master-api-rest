// Importar modelos
const Follow = require("../models/follows");
const User = require("../models/user");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//Importar servicio
const followServices = require("../services/followServices");



//Acciones de prueba
const pruebaFollows = (req, res) => {
    return res.status(200).json({
        messague: "Mesanej enviado desde: controllers/follows.js"
    });
}
//Acción de guardar un follow (accion seguir)

const save = async (req, res) => {

    //A travez de x-www-form-urlencoded pasamos el followeb, que es el usuario al que voy a seguir
    //Conseguir datos del body // -> es pasarle el followed o el usuario que quiero seguir

    const params = req.body;

    //A qué usuario voy a seguir, sacar id del usuario 
    //Principalmente lo que voy a tener en el body es el followeb
    //Sacar id del usuario identificado 
    const identity = req.user;
    //Crear objeto con modelo follow

    //primera forma 
    // let userToFollow = new Follow();
    // userToFollow.user = identity.id;
    // userToFollow.followeb = req.followeb;

    //segunda forma
    let userToFollow = new Follow({
        user: identity.id, //  id del usuario identificado
        followeb: params.followeb, //id del usuario al que queremos seguir
    });

    //Guardar objeto en la  bbdd.
    try {

        followStore = await userToFollow.save();

        if (!followStore) {

            return res.status(400).json({
                status: "error",
                messague: "error en al guardar follow, valide los datos enviados",
            });
        }

        return res.status(200).json({
            status: "Succes",
            messague: "metodo dar follow",
            identity: req.user,
            follow: followStore
        });

    } catch {
        return res.status(200).json({
            status: "error",
            messague: "Error en la ejecución",

        });
    }

}

const unfollow = async (req, res) => {
    //Recoger el id del usuario identificado
    const userId = req.user.id;

    //Recojer el id del usuario que sigo y quiero dar unfollow
    const followebId = req.params.id;

    if (!ObjectId.isValid(followebId)) {
        console.log('El ID del usuario no es válido, debe contener 24 caracteres hexadecimales. Si el valor es un número entero, debe ser menor que 2^32, Estos 24 caracteres hexadecimales deben corresponder a los dígitos del 0 al 9 y las letras minúsculas de la "a" a la "f"');
        return res.status(400).json({
            messaje: "El ID del usuario no es válido, debe contener 24 caracteres hexadecimales. Si el valor es un número entero, debe ser menor que 2^32, Estos 24 caracteres hexadecimales deben corresponder a los dígitos del 0 al 9 y las letras minúsculas de la 'a a la 'f'",
            status: "error"
        });
    }

    try {

        //Find de las coincidencias, id del usuario idetificado con el id del usuario que sigue y quiere dejar de seguir
        const followDeleted = await Follow.deleteOne({
            "user": userId,
            "followeb": followebId,
        });

        console.log(followDeleted);

        if (!followDeleted) {
            return res.status(400).send({
                status: "success",
                messague: "error al eliminar followeb",
            });
        }

        //Ejecutar remove
        return res.status(200).send({
            status: "success",
            //messague:"Follow eliminado correctamente",
            user: req.user,
            followDeleted,
        });

    } catch (error) {

        console.log(error);

        return res.status(200).send({
            status: "error",
            messague: "Ha ocurrido un error en el servidor",
        });
    }





}

// Listado de usuarios que estoy siguiendo
const following = async (req, res) => {
    //sacar la id del usuario identificado 
    let userId = req.user.id;

    //Comprobar si me llaga el id por parametro en la url
    if (req.params.id) {
        userId = req.params.id; //En caso de que llegue el id, lo asigno a la variable userId
    }

    //Controlar en que pagina estamos
    //Creamos una variable page y le asignamos como parametro inicial 1 para indicar que la paginación por defecto sera la número 1
    let page = 1;
    
    //Comprobar si me llaga la pagina por parametros en la url
    if (req.params.page) {
        //Si el paramertro page de la url no llega vacío 
        //lo convertimos en un entero y se lo pasamos a la variable page 
        //que va a controlar la paginación de la aplicación
        //con page le voy a indicar a la aplicación en que pagina de los resultados obtenidos quiero ubicarme
        page = parseInt(req.params.page);
    }

    //Cuantos usuarios por página quiero mostrar?
    //Le indico a mi programa cuantos documentos por pagina quiero mostrar, por ejemplo si quiero 2 usuarios por página
    let itemsPerPage = 2;

    //
    const options = {
        page,                   // Número de página actual
        limit: itemsPerPage,    // Número de documentos por página
        sort: '_id',             //ordenar por id
        select: '-_id  -__v',  // Campos a excluir de los documentos
        // select: '-_id -Created_at -__v',  // Campos a excluir de los documentos
    };

    // const result = await Follow.paginate({}, options);
    // console.log("result:",result);

    //Find a follow que estamos siguiendo, popular dtos de los usuarios y paginar con moongoose paginate

    try {
        // let follows = await Follow.find({ user: userId }); //Esta consulta funciona pero quiero aplicar otros filtros
        // let follows = await Follow.find({ user: userId }).populate("user followeb","-password -role -__v").paginate({},options); // no me funciono esta consulta
        // let follows = await Follow.paginate({ user: userId },options).populate("user followeb"); // no me funciona esta consulta
        const follows = await Follow.paginate({ user: userId }, options);
        // const follows = await Follow.find({ user: userId }).populate("user followeb","-password -role -__v").paginate({},options); // no me funciono esta consulta

        console.log ("follows:", follows);

        const populatedFollows = await Follow.populate(follows.docs, [

            // En Mongoose, path es una opción utilizada en la función populate() 
            // para indicar el nombre del campo que deseas poblar en una consulta de poblado.
            // En el código anterior, path se utiliza para especificar los nombres de los campos que deseas poblar. 
            // En este caso, se utiliza 'user' y 'followeb' como valores de path para indicar los campos que deseas poblar en los documentos de follows.docs.

            { path: 'user', select: '-password -role -__v' },    //-password -role -__v  --> para eliminar los campos que no quiero ver en la respuesta enviada al cliente 
            { path: 'followeb', select: '-password -role -__v' } //-password -role -__v  --> para eliminar los campos que no quiero ver en la respuesta enviada al cliente
          ]);
        // console.log("follows:",follows);

        // return res.status(200).json({
        //     status: "success",
        //     messague: "Listado de usuarios que estoy siguiendo",
        //     follows: follows,
        // });

        // console.log("req.user.id:",req.user.id); // Validar por consola cuál es el id del usuario identificado 

        // Lisado de usuarios que siguen al usuario A y al usuario B
        // Listado de ids, de los usuarios que siguen al usuario identificado y usuarios que sige el usuario identificado,
        // Servira para comprobar si el usuario identificado sigue o lo siguen otros usuarios.

        let followUserIds = await followServices.followUserIds(req.user.id); 
        // Utilizo un servicio llamado followUserIds que me devuelve los usuarios
        // que siguen al usuario identificado y que sigue el usuario identificado.


        return res.status(200).json({
            status: "success",
            message: "Listado de usuarios que estoy siguiendo",
            // follows: populatedFollows,  // Accede a los documentos paginados en la propiedad 'docs'
            follows: follows.docs,  // Le muestro al cliente solo los documentos encontrados durante la consulta paginate
            // totalPages: follows.totalPages,  // Total de páginas disponibles
            // totalFollows: follows.totalDocs,  // Documentos en total
            // // currentPage: follows.page,  // Número de página actual
            // //pages: Math.ceil(follows.totalDocs/itemsPerPage),
            // user_following: followUserIds.following,  // listado de los ids, de los usuarios que siguen al usuario identificado
            // user_follow_me: followUserIds.followers   // listado de los ids, de los usuarios que sigue el usuario identificado
            user_following: followUserIds.followingArray,  // listado de los ids, de los usuarios que siguen al usuario identificado
            user_follow_me: followUserIds.followersArray   // listado de los ids, de los usuarios que sigue el usuario identificado
          });


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener el listado de usuarios seguidos",
            error: error.message,
        });
    }


    // Follow.find({ user: userId }).exec((error, follows) => {


    // });

    // try {
    //     const follows = await Follow.find({ user: userId }).exec();

    //     return res.status(200).json({
    //       status: "success",
    //       message: "Listado de usuarios que estoy siguiendo",
    //       follows: follows,
    //     });
    //   } catch (error) {
    //     return res.status(500).json({
    //       status: "error",
    //       message: "Error al obtener el listado de usuarios seguidos",
    //       error: error.message,
    //     });
    //   }

}

//Listado de usuarios que me siguen
const followers = (req, res) => {
    return res.status(200).json({
        status: "success",
        messague: "Listado de usuarios que me siguen",
    });
}

module.exports = {
    pruebaFollows,
    save,
    unfollow,
    following,
    followers
}

