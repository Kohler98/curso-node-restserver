const {response, request} = require('express')

const usuariosGet = (req = request, res = response) => {

    const {q,nombre = "no name",apikey, page=1} = req.query

    res.status(500).json({
        ok:true,
        msg:"get Api desde el controlador",
        q,
        nombre,
        apikey,
        page
    })
}

const usuariosPut = (req, res) => {
    const {id} = req.params
    res.json({
        ok:true,
        msg:"put Api desde el controlador",
        id
    })
}

const usuariosPost = (req, res) => {
    const {nombre, edad} = req.body
    res.json({
        ok:true,
        nombre,
        edad
    })
}

const usuariosPatch = (req, res) => {
    res.json({
        ok:true,
        msg:"patch Api desde el controlador"
    })
}

const usuariosDelete = (req, res) => {
    res.json({
        ok:true,
        msg:"delete Api desde el controlador"
    })
}
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}