const mongoose = require("mongoose");
function fallo(mensaje) {
    return Object.assign(new Error(mensaje), { status: 400 });
}
function validarId(req, res, next) {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) return next(fallo("ID de producto inválido"));
    next();
}
function validarProducto(req, res, next) {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) return next(fallo("Se espera un objeto de producto"));
    const campos = ["nombre", "descripcion", "precio", "cantidad", "categoria"];
    if (!Object.keys(body).length || Object.keys(body).some(key => !campos.includes(key))) {
        return next(fallo("El producto está vacío o contiene campos no permitidos"));
    }
    for (const campo of ["nombre", "precio", "cantidad"]) {
        if (req.method === "POST" && body[campo] === undefined) return next(fallo(`Falta el campo ${campo}`));
    }
    for (const campo of ["nombre", "descripcion", "categoria"]) {
        if (body[campo] !== undefined && (typeof body[campo] !== "string" || (campo === "nombre" && !body[campo].trim()))) {
            return next(fallo(`Campo ${campo} inválido`));
        }
    }
    for (const campo of ["precio", "cantidad"]) {
        if (body[campo] !== undefined && (typeof body[campo] !== "number" || !Number.isFinite(body[campo]) || body[campo] < 0 || (campo === "cantidad" && !Number.isInteger(body[campo])))) {
            return next(fallo(`Campo ${campo} inválido: debe ser un número no negativo; cantidad debe ser entera`));
        }
    }
    next();
}
module.exports = { validarId, validarProducto, fallo };
