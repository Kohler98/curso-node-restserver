const { response } = require("express");
const {Producto, Categoria} = require('../models');
const { body } = require("express-validator");


const print = (info) =>{
    console.log(info)
}
// obtenerProductos - paginado - total - populate
const obtenerProductos = async(req, res = response)=>{
    const {limite = 5, desde = 0 } = req.query
    const query = {estado:true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate("usuario", "nombre")
            .populate("categoria", "nombre")
            .skip(Number(desde))
            .limit(Number(limite))
])
     res.json({
        total,
        productos
     })
} 

// obtenerProducto por id
const obtenerProducto = async(req, res = response)=>{
    const {id} = req.params
 
    const producto = await Producto.findById(id).populate("categoria", "nombre")
    
    if (!producto.estado){
        return res.status(400).json({
            msg:`El producto ${producto.nombre}, ya no existe`
        })
    }

    res.json(producto)
    
} 


// crear una Producto
const crearProducto = async(req, res = response)=>{
    const {estado, usuario, ...body} = req.body
    const {_id} = await Categoria.findById(body.categoria)
    nombre = body.nombre
    // if (!estado){
    //     return res.status(400).json({
    //         msg:`La categoria ${Categoria.findById(req.body.categoria).nombre}, no existe`
    //     })
    // }
    //verificar si existe en la base de datos
    const productoDb = await Producto.findOne({nombre})
    if (productoDb){
        return res.status(400).json({
                msg:`El Producto ${productoDb.nombre}, ya existe`
            })
            
    }
    
    // generar data a guardar
    const data = {
        ...body,
        nombre : body.nombre.toUpperCase(),
        ...(body.precio && { precio: body.precio }),
        usuario: req.usuario._id,
        categoria :_id,
   
    };
    const producto = new Producto(data)
   
    //guardar el registro
    await producto.save()
    
    res.json({
    
        producto
    })
    
}
// actualizar producto por id
const actualizarProducto = async(req, res = response)=>{
    const {id} = req.params
    const {estado, usuario, ...data} = req.body
    if (data.nombre){
        
        data.nombre = data.nombre.toUpperCase()
    }
    data.usuario = req.usuario.id
    nombre = data.nombre

    const categoriaDb = await Categoria.findOne({nombre})
 
    
    if (categoriaDb){
        return res.status(400).json({
                msg:`La categoria ${categoriaDb.nombre}, ya existe`
            })         
    }

    const categoria = await Producto.findByIdAndUpdate(id,data,{new:true})
   
    res.status(201).json({
        categoria,
        msg:`La categoria ha sido actualizada`
    })
    
} 
// // borrar producto -estado : false
const borrarProducto = async(req, res = response)=>{
    const {id} = req.params
    const producto = await Producto.findByIdAndUpdate(id,{estado:false}, {new:true})
 
    res.json({
        producto,
        msg:`El producto ${producto.nombre} fue borradao exitosamente`
    })
    
} 

module.exports = {
    crearProducto,
    borrarProducto,
    actualizarProducto,
    obtenerProducto,
    obtenerProductos,
}