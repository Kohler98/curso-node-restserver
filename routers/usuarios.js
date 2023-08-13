const { usuariosGet, usuariosPut, usuariosPatch, usuariosPost, usuariosDelete } = require("../controllers/usuarios");
const {Router} = require("express");
const {check} = require("express-validator");
const { esRolValido, emailExiste, existeUsuarioPorId } = require("../helpers/db-validators");
// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole,tieneRole } = require("../middlewares/validar-roles");
const {
    validarCampos,validarJWT,esAdminRole,tieneRole
} = require('../middlewares')

const router = Router();
    
router.get('/', usuariosGet)    

router.put('/:id',[
    check('id',"No es un id valido ").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRolValido),
    validarCampos
], usuariosPut)     

router.post('/',[
    check('nombre', "El nombre es obligatorio").not().isEmpty(),
    check('password', "La contraseña no es valida y debe tener  mas de 6 letras").isLength({min:6}),
    check('correo', "El correo no es valido").isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', "No es un rol valido").isIn(['ADMIN_ROL', "USER_ROL"]),
    check('rol').custom( esRolValido),
    validarCampos
], usuariosPost)   

router.patch('/', usuariosPatch)  

router.delete('/:id',[
    validarJWT,
    // este middleware fuerza a que el usuario tenga que se administrador
    // esAdminRole,
    tieneRole("ADMIN_USER","VENTAS_ROLE"),
    check('id',"No es un id valido ").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    // validarCampos
], usuariosDelete)     





module.exports = router