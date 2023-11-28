 
const dbValidators = require('./db-validators')
const generarJWT = require('./generar-jwt')
const googleVerify = require('./google-verify')
const subirArchivo = require('./subir-archivos')
const compararImagenes = require('./comparar-imagen')
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
    ...compararImagenes
}