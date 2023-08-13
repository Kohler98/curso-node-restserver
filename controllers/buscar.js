const { response} = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const {ObjectId} = require('mongoose').Types
const coleccionesPermitidas = [

    "usuarios",
    "categoria",
    "productos",
    "roles"   
]
const buscarUsuarios = async(termino = "" , res = response) =>{
    const esMongoId = ObjectId.isValid(termino)
    
    if( esMongoId){
        const usuario = await Usuario.findById(termino)
        return res.json({
            results:(usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const usuarios = await Usuario.find({
        $or:[{nombre:regex}, {correo:regex}],
        $and:[{estado:true}]
    })

    res.json({
        results: usuarios
    })
}
const buscarCategoria = async(termino = "" , res = response) =>{
    const esMongoId = ObjectId.isValid(termino)
    
    if( esMongoId){
        const categoria = await Categoria.findById(termino)
        return res.json({
            results:(categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const categoria = await Categoria.find({nombre:regex, estado:true})

    res.json({
        results: categoria
    })
}
const buscarProductos = async(termino = "" , res = response) =>{
    const esMongoId = ObjectId.isValid(termino)
    
    if( esMongoId){
        const producto = await Producto.findById(termino).populate('categoria','nombre')
        return res.json({
            results:(producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const producto = await Producto.find({nombre:regex, estado:true})
                           .populate('categoria','nombre')
    res.json({
        results: producto
    })
}
const buscar = async(req, res=response) =>{
    const {coleccion, termino} = req.params
    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colleciones permitidas son : ${coleccionesPermitidas}`
        })
    }
    switch (coleccion){
        case "usuarios":
            buscarUsuarios(termino,res)
        break
        case "categoria":
            buscarCategoria(termino,res)
        break
        case "productos":
            buscarProductos(termino,res)
        break
        case "roles":   
        break

        default:
            res.status(400).json({
                msg:"Se me olvido hacer esta busqueda"
            })
    }
 
}


module.exports = {
    buscar
}