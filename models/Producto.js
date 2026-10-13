const mongoose = require("mongoose");
const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    precio: { type: Number, required: true, min: 0 },
    cantidad: { type: Number, required: true, min: 0, validate: Number.isInteger },
    categoria: { type: String, trim: true },
    fechaIngreso: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Producto", productoSchema);
