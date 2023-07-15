// const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

// const connection = async()=>{
//     try {
//         await mongoose.connect("mongodb://localhost:27017/mi_blogs",{ useNewUrlParser: true });
//         console.log("conectado correctamente a bd: mi_red_social");
//     } catch (error) {
//         console.log(error);
//         throw new Error("No se ha podido conectar a la base de datos");
//     }
// }

// module.exports = connection;



const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const conexion = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/mi_red_social', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Conexión exitosa a la base de datos');
    } catch (error) {
      console.log('Error de conexión a la base de datos:', error.message);
    }
  };

//una vez hecha la conexión, la exportamos
// module.exports = conexion

//una vez hecha la conexión, la exportamos
module.exports = {
    conexion
}