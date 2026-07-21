const express = require("express");

const router = express.Router();

const {

    crearProducto,
    obtenerProductos,
    actualizarStock,
    obtenerCategoria,
    bajoStock

} = require("../controllers/productosController");

// CRUD

router.post("/", crearProducto);

router.get("/", obtenerProductos);



router.put("/actualizar-stock", actualizarStock);

router.get("/categoria/:categoria", obtenerCategoria);

router.get("/bajo-stock/:cantidad", bajoStock);

module.exports = router;