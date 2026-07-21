const Producto = require("../models/Producto");

const crearProducto = async (req, res) => {

    try {

        const producto = new Producto(req.body);

        await producto.save();

        res.status(201).json(producto);

    } catch (error) {

        res.status(500).json({mensaje: error.message});

    }

};

const obtenerProductos = async (req, res) => {

    try {

        const productos = await Producto.find();

        res.json(productos);

    } catch (error) {

        res.status(500).json({mensaje: error.message});

    }

};

const actualizarStock = async (req, res) => {

    try {

        const productos = req.body;

        for (const p of productos) {

            await Producto.findByIdAndUpdate(
                p.id,
                { cantidad: p.cantidad }
            );

        }

        res.json({
            mensaje: "Stock actualizado correctamente"
        });

    } catch (error) {

        res.status(500).json({mensaje: error.message});

    }

};

const obtenerCategoria = async (req, res) => {

    try {

        const categoria = req.params.categoria;

        const productos = await Producto.find({
            categoria: categoria
        });

        res.json(productos);

    } catch (error) {

        res.status(500).json({mensaje: error.message});

    }

};

const bajoStock = async (req, res) => {

    try {

        const cantidad = Number(req.params.cantidad);

        const productos = await Producto.find({
            cantidad: {
                $lt: cantidad
            }
        });

        res.json(productos);

    } catch (error) {

        res.status(500).json({mensaje: error.message});

    }

};

module.exports = {

    crearProducto,
    obtenerProductos,
    actualizarStock,
    obtenerCategoria,
    bajoStock

};