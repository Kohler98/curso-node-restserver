const {Router} = require("express");
const {check} = require("express-validator");
const { validarCampos,validarArchivo } = require("../middlewares");
const {cargarArchivos, actualizarImagen, mostrarImg} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");
 


const router = Router();
    
router.post('/',cargarArchivos) 

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id','El id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],actualizarImagen)

router.get('/:coleccion/:id',[
    check('id','El id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos

],mostrarImg)

module.exports = router