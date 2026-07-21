const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/inventarioRopa")
.then(() => console.log("Base de datos conectada"))
.catch(err => console.log(err));

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const productosRoutes = require("./routes/productos");
app.use("/productos", productosRoutes);
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});