const Follow = require("../models/follows");

// identityUserId // id del usuario que ha iniciado sesión
// 
const followUserIds = async (identityUserId) => {
    try {
        //console.log("identityUserId: ", identityUserId); //probamos el id que nos esta llegando para la consulta

        // Devolver documentos cuyo campo user corresponda con el id del usuario que inicio sesión, de la consulta devuelva solo el followeb
        // following devuelve los usuarios que esta siguiendo el usuario que inicio sesión o usuario identificado
        //"user": identityUserId // usuario que sigue
        //followeb usuario que sigue identityUserId o usuario logueado
        let following = await Follow.find({ "user": identityUserId }).select("followeb -_id");
        //.select({ "_id": 0, "__v": 0, user: 0, "Created_at": 0 }); // no me funciono este filtro

        // followers devuelve los usuarios que estan siguiendo al usuario que inicio sesión o usuario identificado
        //"followeb": identityUserId //usuario seguido
        //user usuario que sigue a identityUserId o usuario identificado o logueado
        let followers = await Follow.find({ "followeb": identityUserId }).select("user -_id");
        //.select({ "_id": 0, "__v": 0, user: 1, "Created_at": 0 }); // no me funciono este filtro


        //codigo de prueba para aplica populate al array followers
        // const populatedFollows = await Follow.populate(followers, [

        //     // En Mongoose, path es una opción utilizada en la función populate() 
        //     // para indicar el nombre del campo que deseas poblar en una consulta de poblado.
        //     // En el código anterior, path se utiliza para especificar los nombres de los campos que deseas poblar. 
        //     // En este caso, se utiliza 'user' y 'followeb' como valores de path para indicar los campos que deseas poblar en los documentos de follows.docs.

        //     { path: 'user', select: 'name' },    //-password -role -__v  --> para eliminar los campos que no quiero ver en la respuesta enviada al cliente 
        //     //{ path: 'followeb', select: '-_id -role -__v'  } //-password -role -__v  --> para eliminar los campos que no quiero ver en la respuesta enviada al cliente
        //   ]);

        // console.log("populatedFollows: ", populatedFollows); // codigo de prueba

        // console.log("following: ", following); // ver por consola los datos de following
        // console.log("followers: ", followers); // ver por consola los datos de followers

        // Obtener un solo array de los valores de 'followeb'
        let followingArray = following.map(follow => follow.followeb);
        // Obtener un solo array de los valores de 'user'
        let followersArray = followers.map(follower => follower.user);


        // console.log("followingArray: ", followingArray); // ver por consola los datos de followingArray
        // console.log("followersArray: ", followersArray); // ver por consola los datos de followersArray

        // //otra opción al codigo anterio puede ser 
        // let followingClean = [];
        // let followersgClean = [];

        // following.forEach(follow => {
        //     followingClean.push(follow.followeb)
        // });

        // followers.forEach(follower => {
        //     followersgClean.push(follower.user)
        // });

        // return {
        //     followingClean,
        //     followersgClean
        // }

        return {
            followingArray,
            followersArray
        }

        // return {
        //     following,
        //     followers
        // }


    } catch (error) {
        return {}
    }
}



// Función que me permite saber si un usuario me sigue o no, cuando yo ingrese a mirar su perfil, y si yo lo sigo o no lo sigo 
// Me permite saber si un usuario me sigue y yo lo sigo o no
//Quiero comprobar si lo estoy siguiendo o si me sigue
const followThisUser = async (identityUserId, profileUserId) => {

    // identityUserId  es el usuario identificado o usuario que ha iniciado sesión 
    // profileUserId es el usuario con el que quiero comprobar si es seguido por el identityUserId 

    console.log("identityUserId: ", identityUserId);
    console.log("profileUserId: ", profileUserId);

    try {

        //Comprobar si el usuario identityUserId sigue a profileUserId
        let following = await Follow.findOne({ "user": identityUserId, "followeb": profileUserId })
        // .select("followeb -_id"); //-> compruebo si lo sigo

        console.log("following: ", following);


        //Comprobar si el usuario profileUserId sigue a identityUserId
        let followers = await Follow.find({ "user": profileUserId, "followeb": identityUserId })
        // .select("user -_id");  //-> compruebo si me sigue
        console.log("followers: ", followers);

        // // Obtener un solo array de los valores de 'followeb'
        // let followingArray = await following.map(follow => follow.followeb);
        // // Obtener un solo array de los valores de 'user'
        // let followersArray = await followers.map(follower => follower.user);

        // console.log("followingArray: ",followingArray);
        // console.log("followersArray: ", followersArray);

        // return {
        //     followingArray,
        //     followersArray
        // }

        //otra opción al codigo anterio puede ser 
        // let followingClean = [];
        // let followersgClean = [];

        // following.forEach(follow => {
        //     followingClean.push(follow.followeb)
        // });

        // followers.forEach(follower => {
        //     followersgClean.push(follower.user)
        // });

        // console.log("followingClean: ",followingClean);
        // console.log("followersgClean: ", followersgClean);

        // return {
        //     followingClean,
        //     followersgClean
        // }

        return {
            following,
            followers
        }

    } catch (error) {
        return {}
    }

}






module.exports = {
    followUserIds,
    followThisUser
}