const defaults = [3000, 5173, 5174].flatMap(port => [
    `http://localhost:${port}`, `http://127.0.0.1:${port}`
]);
const origins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map(origin => origin.trim()).filter(Boolean)
    : defaults;

module.exports = {
    origin(origin, callback) {
        if (!origin || origins.includes(origin)) return callback(null, true);
        const error = new Error("Origen no permitido por CORS");
        error.status = 403;
        callback(error);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204
};
