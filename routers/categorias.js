const {Router} = require("express");
const {check} = require("express-validator");
const { validarJWT,validarCampos, esAdminRole } = require("../middlewares");
const { crearCategoria, obtenerCategorias, obtenerCategoriasPopulate, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");
const {existeCategoriaPorId } = require("../helpers/db-validators");

const router = Router()
/**
 *  {{url}}/api/categorias
 * 
 */
//obtener todas las categorias
router.get('/',[
    validarJWT,
    
],obtenerCategorias)
//obtener categoria por id - public
router.get('/:id',[
    check('id',"No es un id valido ").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
],obtenerCategoriasPopulate)
//crear categoria  - privado para cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria)
//actualizar categoria  - privado para cualquier persona con un token valido
router.put('/:id',[
    validarJWT,
    check('id',"No es un id valido ").isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
    
],actualizarCategoria)
//borrar categoria  - privado solo si es administrador podra borrar
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id',"No es un id valido ").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos

],borrarCategoria)

module.exports = router