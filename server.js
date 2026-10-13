if (require("node:fs")
    .existsSync(require("node:path")
    .join(__dirname, ".env"))) process.loadEnvFile(require("node:path")
    .join(__dirname, ".env"));
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");
const corsOption = require("./config/corsOption");
const productosRoutes = require("./routes/Productos");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
app.use(cors(corsOption));
app.use(express.json({ limit: "100kb" }));
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/productos", productosRoutes);
app.use((req, res) => res.status(404).json({ mensaje: "Ruta no encontrada" }));
app.use(errorHandler);

async function iniciar() {
    await conectarDB();
    const port = Number(process.env.PORT || 3000);
    return app.listen(port, () => console.log(`API disponible en http://localhost:${port}`));
}

if (require.main === module) {
    iniciar().catch(() => {
        console.error("No se pudo iniciar la API. Verificá MongoDB y MONGODB_URI.");
        process.exitCode = 1;
    });
}
module.exports = { app, iniciar };
