const {response, request} = require('express')
const Usuario = require("../models/usuario")
const bcryptjs = require("bcryptjs")



const usuariosGet = async(req = request, res = response) => {

    // const {q,nombre = "no name",apikey, page=1} = req.query
    const {limite = 5, desde = 0 } = req.query
    const query = {estado:true}
    // const usuarios  = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite))

    // const total = await Usuario.countDocuments(query)

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    res.json({
        total,
        usuarios
        
    })
}

const usuariosPut = async(req, res) => {
    const {id} = req.params
    const {_id,password, google,correo, ...resto} = req.body

    //validar contra la base de datos

    if(password){
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync("password", salt);

    }
    const usuario = await Usuario.findByIdAndUpdate(id,resto)
    res.json({
        usuario,
        msg:"put Api desde el controlador",
     
    })
}

const usuariosPost = async(req, res = response) => {
    
    const {nombre,correo,password,rol} = req.body

    const usuario = new Usuario({nombre,correo,password,rol})
      
    //encriptar contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt);


    //guardar el registro
    await usuario.save()
    
    res.json({
    
        usuario
    })
}

const usuariosPatch = (req, res) => {
    res.json({
        ok:true,
        msg:"patch Api desde el controlador"
    })
}

const usuariosDelete = async(req, res = response) => {
    const {id} = req.params
    // const uid = req.uid
    // //borrado fisicamente

    // const usuario = await Usuario.findByIdAndDelete(id)

    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false})
 
    res.json(usuario)
}
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}