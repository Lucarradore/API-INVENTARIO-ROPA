const mongoose = require("mongoose");

module.exports = async function conectarDB() {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/inventarioRopa";
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Base de datos conectada");
};
