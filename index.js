//Importar dependencias
const {conexion} = require("./database/conexion");
const express = require("express");
const cors = require("cors");

//Mensaje de bienvenida
console.log("API NODE para RES SOCIAL arrancada!!");
//Conexión a base de datos
conexion();

//Crear servidor node
const app= express();
const puerto = 3900;

//Configurar el cors
app.use(cors());

//convertir los datos del body a objetos json.
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cargar las rutas a express
//El app.use se usa para cargar una configuración dentro de express, o para ejecutar algo dentro de express y yo quiero cargar dentro de express la configuración de las rutas por lo tanto tendría que hacer uso del app.use
const userRoutes = require("./routes/users");
const publicationRoutes = require("./routes/publications");
const userFollows = require("./routes/follows");


app.use("/api/users",userRoutes);
app.use("/api/publications",publicationRoutes);
app.use("/api/follows",userFollows);




//ruta de prueba
app.get("/ruta-prueba/",(req,res)=>{
    return res.status(200).json(
        {
            "id":1,
            "nombre":"diego",
            "web":"diegohernandez.com"
        }
    );
})

//Poner servidor a escuchar peticiones http
app.listen(puerto, ()=>{
    console.log("servidor de node corriendo en le puerto: ", puerto);
});


