const {Router} = require("express");
const { buscar } = require("../controllers/buscar");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router()

router.get('/:coleccion/:termino', buscar)

module.exports = router