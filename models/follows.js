const {Schema, model} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const FollowSchema = Schema({
    //Definimos el campo user que hace referencia a los usuarios que siguen a otros usuarios
    user:{
        type: Schema.ObjectId,
        ref: "User"
    },
    //Definimos el campo followeb que hará referencia a los usuarios seguidos por otros usuarios
    followeb:{
        type: Schema.ObjectId,
        ref:"User"
    },
    //Definimos el campo Created_at que hará referencia a la fecha en que se creo el evento seguir
    Created_at:{
        type: Date,
        default: Date.now
    }
});

FollowSchema.plugin(mongoosePaginate);

module.exports = model("Follow",FollowSchema,"follows");

// Este código utiliza el módulo "mongoose" para definir y exportar un modelo llamado "Follow" que representa una colección en una base de datos MongoDB. A continuación, te explicaré las partes clave del código:

// Primero, se importan las dependencias necesarias del paquete "mongoose" utilizando la destructuración del objeto. El código utiliza la función require("mongoose") para obtener el módulo completo y luego extrae dos objetos específicos: Schema y model. Estos objetos se utilizarán para definir el esquema del modelo y crear el modelo en sí.

// Luego, se define el esquema del modelo llamado "Follow" utilizando Schema({}). El esquema especifica la estructura y los tipos de datos que se almacenarán en cada documento de la colección "follows". El esquema incluye tres campos: "user", "followeb" y "Created_at".

// El campo "user" se define como un tipo "Schema.ObjectId" que hace referencia al modelo "User". Esto indica que este campo almacenará el identificador de un documento de la colección "User".

// El campo "followeb" también se define como un tipo "Schema.ObjectId" y hace referencia al modelo "User". Al igual que el campo anterior, almacenará el identificador de un documento de la colección "User".

// El campo "Created_at" se define como un tipo "Date" y se establece su valor por defecto en la fecha y hora actual utilizando default: Date.now. Esto significa que si no se proporciona un valor para este campo al crear un nuevo documento, se utilizará la fecha y hora actual.

// Finalmente, el modelo "Follow" se crea utilizando model("Follow", FollowSchema, "follows"). El primer argumento es el nombre del modelo, el segundo argumento es el esquema definido anteriormente y el tercer argumento es el nombre de la colección en la base de datos donde se almacenarán los documentos de este modelo.

// Por último, el modelo "Follow" se exporta utilizando module.exports, lo que permite que este modelo se utilice en otros archivos del proyecto.

// En resumen, este código define un modelo de Mongoose llamado "Follow" que representa una colección llamada "follows" en MongoDB. El modelo tiene tres campos: "user", "followeb" y "Created_at". Los campos "user" y "followeb" hacen referencia al modelo "User", mientras que "Created_at" almacena la fecha y hora de creación de cada documento.

