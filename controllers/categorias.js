const { response } = require("express");
const {Categoria} = require('../models');
 
const { populate } = require("dotenv");
const usuario = require("../models/usuario");

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res = response) =>{
    const {limite = 5, desde = 0 } = req.query
    const query = {estado:true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate("usuario", "nombre")
            .skip(Number(desde))
            .limit(Number(limite))
])
     res.json({
        total,
        categorias
     })

}
// obtenerCategoriaspopulate
const obtenerCategoriasPopulate = async(req, res = response) =>{
    const {id} = req.params
 
    const categoria = await Categoria.findById(id).populate("usuario", "nombre")
    
    if (!categoria.estado){
        return res.status(400).json({
            msg:`La categoria ${categoria.nombre}, ya no existe`
        })
    }

    res.json(categoria)
 
}
// crear una categoria
const crearCategoria = async(req,res = response) =>{

    
    const nombre = req.body.nombre.toUpperCase()
    const categoriaDb = await Categoria.findOne({nombre})
    
 
    if (categoriaDb){
        return res.status(400).json({
                msg:`La categoria ${categoriaDb.nombre}, ya existe`
            })
            
    }

    // generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
   

    // guardar DB

    await categoria.save()
    res.status(201).json({
        categoria,
        msg:`Ha sido creada una categoria`
    })
    
    
   
}

// actualizarCategoria
const actualizarCategoria = async(req, res = response)=>{
    const {id} = req.params
    const {estado, usuario, ...data} = req.body
    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario.id
    nombre = data.nombre

    const categoriaDb = await Categoria.findOne({nombre})
 
    
    if (categoriaDb){
        return res.status(400).json({
                msg:`La categoria ${categoriaDb.nombre}, ya existe`
            })         
    }

    const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true})
   
    res.status(201).json({
        categoria,
        msg:`La categoria ha sido actualizada`
    })

}
// borrarCategoria -estado : false
const borrarCategoria = async(req, res = response)=>{
    const {id} = req.params
    const categoria = await Categoria.findByIdAndUpdate(id,{estado:false}, {new:true})
 
    res.json({
        categoria,
        msg:`La categoria ${categoria.nombre} fue borrada exitosamente`
    })
}
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasPopulate,
    actualizarCategoria,
    borrarCategoria
}