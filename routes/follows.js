const express = require("express");
const router = express.Router();
const followsController = require("../controllers/follows");
const check = require("../midlewares/auth");

//Definir rutas
router.get("/pruebas-follows",followsController.pruebaFollows);
router.post("/save",check.auth,followsController.save);
router.delete("/unfollow/:id",check.auth,followsController.unfollow);
router.get("/following/:id?/:page?",check.auth,followsController.following);
router.get("/followers/:id?/:page?",check.auth,followsController.followers);


//Exportar el router

module.exports= router