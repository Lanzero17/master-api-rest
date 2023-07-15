const {Schema, model} = require("mongoose");

const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = Schema({
    
    name:{
        type:String,
        required:true
    },
    surname: String,
    bio:String,
    nick:{
        type:String,
        required:true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    role:{
        type: String,
        default:"role_user"
    },
    image:{
        type: String,
        default:"defaul.png"
    },
    Create_at:{
        type: Date,
        default: Date.now
    }

});

UserSchema.plugin(mongoosePaginate);

// module.exports = model("nombre de mi modelo", le paso el esquema es decir el formato que va a tener ese modelo, que es el objeto con todas las caracteristicas que va a tener cada documeto o cada objeto de este tipo , es indicarle en que colección voy a guardar este objeto);
module.exports = model("User",UserSchema,"users");