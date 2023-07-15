//Importar dependencias y modulos

//Importamos el modelo de usuarios
const User = require("../models/user");
const bcryp = require("bcrypt");

const pruebaUser = (req, res) => {
    return res.status(200).json({
        messague: "Mesanej enviado desde: controllers/users.js"
    });
}

// //Metodo de registro
// const register = (req, res) => {
//     // Recoger datos de la petición
//     let params = req.body;

//     //Comprobar que me llegan bien los params
//     //Estas validaciones pueden ser más elaboradas, se requiere investigar más sobre validaciones en js
//     //Lo siguiente se llama clausula de guardas, con esto ahorramos varios if
//     if (!params.name || !params.email || !params.password || !params.nick) {

//         console.log("!Pasa validación minima");

//         return res.status(400).json({
//             messaje: "Faltan datos por enviar",
//             status: "error"
//         });
//     }
    // }else{
    //     console.log("!no se cumplio la valisación minima!");
    // }

    //crear un objeto de usuario con los datos validados
    // let userToSave = new User(params);
    // console.log(userToSave);
    // console.log("-------");


    // Control de usuarios duplicados
    // Se realiza una busqueda en la base de datos de mongose para ver 
    // si hay documentos que coincidan con el correo y nickname que estoy enviando a trávez del body


//     User.find({
//         $or: [
//             { email: user_to_save.email.toLowerCase() },
//             { nick: user_to_save.nick.toLowerCase() }
//         ]

//     }).exec((error, users) => {
//         if (error) {
//             return res.status(500).json({
//                 status: "Error",
//                 messague: "Error en la consulta de usuarios"
//             });
//         }
//         if (user && user.length >= 1) {
//             return res.status(200).send({
//                 status: "success",
//                 messague: "El usuario ya existe"
//             });
//         }

//             // Cifrar la contraseña
//             // bcryp.hash(user_to_save.password,10, (error,pwd)=>{
//             //     console.log(pwd);
//             // })
//             // Guardar usuario en la base de datos
//             // Devolver resultado
//             return res.status(200).json({
//                 messaje: "Acción de registro de usuarios",
//                 status: "success",
//                 user_to_save
//             });

//     })
// }

    // async function findUsers(user_to_save) {
    //     try {
    //         const users = await User.find({
    //             $or: [
    //                 { email: user_to_save.email.toLowerCase() },
    //                 { nick: user_to_save.nick.toLowerCase() }
    //             ]
    //         }).exec();
    //         console.log(users);
    //         if (users && users.length >= 1) {
    //             return res.status(200).send({
    //                 status: "success",
    //                 messague: "El usuario ya existe"
    //             });
    //         }
    //         return res.status(200).json({
    //             messaje: "Acción de registro de usuarios",
    //             status: "success",
    //             user_to_save
    //         });

    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({
    //             status: "Error",
    //             messague: "Error en la consulta de usuarios"
    //         });
    //     }
    // }

    // async function findUsers(userToSave) {
    //     console.log("funcion async");
    //     try {
    //       const users = await User.find({
    //         $or: [
    //           { email: userToSave.email.toLowerCase() },
    //           { nick: userToSave.nick.toLowerCase() }
    //         ]
    //       }).exec();
    //       console.log("usuarios:",users);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }

    

    // async function registerUser(req, res) {
    //     const userToSave = req.body;

    //     try {
    //         const existingUsers = await User.find({
    //             $or: [
    //                 { email: userToSave.email.toLowerCase() },
    //                 { nick: userToSave.nick.toLowerCase() }
    //             ]
    //         }).exec();

    //         if (existingUsers && existingUsers.length >= 1) {
    //             return res.status(200).send({
    //                 status: "success",
    //                 messague: "El usuario ya existe"
    //             });
    //         }

    //         // Cifrar la contraseña
    //         const hashedPassword = await bcrypt.hash(userToSave.password, 10);

    //         // Guardar usuario en la base de datos
    //         const newUser = new User({
    //             email: userToSave.email.toLowerCase(),
    //             nick: userToSave.nick.toLowerCase(),
    //             password: hashedPassword
    //         });

    //         const savedUser = await newUser.save();

    //         // Devolver resultado
    //         return res.status(200).json({
    //             messaje: "Acción de registro de usuarios",
    //             status: "success",
    //             savedUser
    //         });

    //     } catch (error) {
    //         return res.status(500).json({
    //             status: "Error",
    //             messague: "Error en la consulta de usuarios"
    //         });
    //     }
    // } 

    // const register = async (req, res) => {

    //     let params = req.body;
    
    //     if (!params.name || !params.email || !params.password || !params.nick) {
    
    //         console.log("!Faltan datos por enviar");
    
    //         return res.status(400).json({
    //             messaje: "Faltan datos por enviar",
    //             status: "error"
    //         });
    //     }
    
    //     let user_to_save = new User(params);
    
    //     try {
    //         const existingUsers = await User.find({
    //             $or: [
    //                 { email: user_to_save.email.toLowerCase() },
    //                 { nick: user_to_save.nick.toLowerCase() }
    //             ]
    //         }).exec();
    
    //         if (existingUsers && existingUsers.length >= 1) {
    //             return res.status(200).send({
    //                 status: "success",
    //                 messague: "El usuario ya existe"
    //             });
    //         }
    
    //         // Guardar usuario en la base de datos
    //         //const savedUser = await user_to_save.save();
    
    //         return res.status(200).json({
    //             messaje: "Acción de registro de usuarios",
    //             status: "success",
    //             //savedUser,
    //             user_to_save
    //         });
    
    //     } catch (error) {
    //         return res.status(500).json({
    //             status: "Error",
    //             messague: "Error en la consulta de usuarios"
    //         });
    //     }
    // }
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

    let user_to_save = new User(params);

    try {
        const existingUsers = await User.find({
            $or: [
                { email: user_to_save.email.toLowerCase() },
                { nick: user_to_save.nick.toLowerCase() }
            ]
        }).exec();

        if (existingUsers && existingUsers.length >= 1) {
            return res.status(200).send({
                status: "success",
                messague: "El usuario ya existe"
            });
        }

        // Guardar usuario en la base de datos
        //const savedUser = await user_to_save.save();

        return res.status(200).json({
            messaje: "Acción de registro de usuarios",
            status: "success",
            //savedUser,
            user_to_save
        });

    } catch (error) {
        return res.status(500).json({
            status: "Error",
            messague: "Error en la consulta de usuarios"
        });
    }
}

module.exports = {
    pruebaUser,
    register
}