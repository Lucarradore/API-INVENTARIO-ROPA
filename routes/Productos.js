const router = require("express").Router();
const controller = require("../controllers/ProductosController");
const { validarId, validarProducto } = require("../middlewares/validarProducto");

router.get("/", controller.obtenerProductos);
router.post("/", validarProducto, controller.crearProducto);
router.put("/actualizar-stock", controller.actualizarStock);
router.get("/categoria/:categoria", controller.obtenerCategoria);
router.get("/bajo-stock/:cantidad", controller.bajoStock);
router.get("/:id", validarId, controller.obtenerProducto);
router.put("/:id", validarId, validarProducto, controller.actualizarProducto);
router.delete("/:id", validarId, controller.eliminarProducto);
module.exports = router;
