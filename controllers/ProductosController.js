const mongoose = require("mongoose");
const Producto = require("../models/Producto");
const { fallo } = require("../middlewares/validarProducto");
const noEncontrado = () => Object.assign(new Error("Producto no encontrado"), { status: 404 });

exports.crearProducto = async (req, res) => res.status(201).json(await Producto.create(req.body));
exports.obtenerProductos = async (req, res) => res.json(await Producto.find());
exports.obtenerProducto = async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    if (!producto) throw noEncontrado();
    res.json(producto);
};
exports.actualizarProducto = async (req, res) => {
    const producto = await Producto.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: "after", runValidators: true });
    if (!producto) throw noEncontrado();
    res.json(producto);
};
exports.eliminarProducto = async (req, res) => {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) throw noEncontrado();
    res.status(204).end();
};
exports.actualizarStock = async (req, res) => {
    const productos = req.body;
    if (!Array.isArray(productos) || !productos.length) throw fallo("Se espera una lista no vacía de { id, cantidad }");
    const ids = new Set();
    for (const p of productos) {
        if (!p || !mongoose.isObjectIdOrHexString(p.id) || !Number.isInteger(p.cantidad) || p.cantidad < 0) {
            throw fallo("Cada producto debe tener un ID válido y una cantidad entera no negativa");
        }
        if (ids.has(p.id.toLowerCase())) throw fallo("No se permiten IDs repetidos");
        ids.add(p.id.toLowerCase());
    }
    const existentes = await Producto.countDocuments({ _id: { $in: [...ids] } });
    if (existentes !== ids.size) throw noEncontrado();
    const resultado = await Producto.bulkWrite(productos.map(p => ({
        updateOne: { filter: { _id: p.id }, update: { $set: { cantidad: p.cantidad } } }
    })));
    if (resultado.matchedCount !== productos.length) throw noEncontrado();
    res.json({ mensaje: "Stock actualizado correctamente" });
};
exports.obtenerCategoria = async (req, res) => res.json(await Producto.find({ categoria: req.params.categoria }));
exports.bajoStock = async (req, res) => {
    const cantidad = Number(req.params.cantidad);
    if (!req.params.cantidad.trim() || !Number.isSafeInteger(cantidad) || cantidad < 0) throw fallo("Cantidad inválida");
    res.json(await Producto.find({ cantidad: { $lt: cantidad } }));
};
