const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publications");

//Definir rutas
router.get("/pruebas-publications",publicationController.pruebaPublication);

//Exportar el router

module.exports= router