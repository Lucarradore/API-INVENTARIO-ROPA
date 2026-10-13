function errorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);
    let status = error.status || 500;
    if (error.name === "ValidationError" || error.name === "CastError") status = 400;
    if (error.code === 11000) status = 409;
    res.status(status).json({
        mensaje: status >= 500 ? "Error interno del servidor" : error.message
    });
}
module.exports = { errorHandler };
