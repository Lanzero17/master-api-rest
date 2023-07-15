const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const check = require("../midlewares/auth");
const multer = require("multer");

//Configuración de subida

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "./uploads/avatars");
    },
    filename:(req, file, cb)=>{
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

//Definir rutas
router.get("/pruebas-usuario",check.auth,userController.pruebaUser);
router.post("/register",userController.register);
router.post("/login",userController.login);
router.get("/profile/:id",check.auth,userController.profile);
router.get("/list/:page?",check.auth,userController.list);
router.put("/update/",check.auth,userController.update);  
router.post("/upload/",[check.auth, uploads.single("file0")],userController.upload);  
router.get("/avatar/:file",check.auth,userController.avatar);

//Exportar el router

module.exports= router