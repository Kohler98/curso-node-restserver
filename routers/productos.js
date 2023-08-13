const {Router} = require("express");
const {check} = require("express-validator");
const { validarJWT,validarCampos, esAdminRole } = require("../middlewares");
const { crearProducto, actualizarProducto, obtenerProducto, obtenerProductos, borrarProducto } = require("../controllers/productos");
const { existeCategoriaPorId, existeProductoPorId, esRolValido } = require("../helpers/db-validators");

const router = Router()

router.get("/",[
    validarJWT,
],obtenerProductos)

router.get("/:id",[
    check('id').custom(existeProductoPorId),
    check('id',"No es un id valido ").isMongoId(),
    validarCampos,
],obtenerProducto)

router.put("/:id",[
    validarJWT,
    check('id',"No es un id valido ").isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProducto)

router.post("/",[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    check('precio','Debe ser un numero').if((value, { req }) => req.body.precio !== undefined)
    .isNumeric()
    .withMessage('Debe ser un numero'),
    validarCampos
],crearProducto)

router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check('id',"No es un id valido ").isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto)

module.exports = router