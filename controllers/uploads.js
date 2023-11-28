const path = require('path')
const { response } = require("express");
const { subirArchivo, compararImagenes } = require("../helpers");
const fs = require('fs')
const { Producto, Usuario } = require("../models");


const cargarArchivos = async(req, res= response) =>{
  
    // imagenes
    try {
        
        const nombre = await subirArchivo(req.files,undefined,'textos')
        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({msg})
    }
}

const actualizarImagen= async(req, res = response) =>{
 
    const {id, coleccion} = req.params
 
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(500).json({
                    msg:`No existe un usuario con este id ${id}`
                })

            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(500).json({
                    msg:`No existe un producto con este id ${id}`
                })

            }
            break;
    
        default:
            return res.status(500).json({msg:"Se me olvido validar esto"})
            break;
    }
    // limpiar imagenes previas
    if (modelo.img){
        // hay que borrar la imagen del servidor  
        const ruta = await compararImagenes(modelo, coleccion) 
        if(fs.existsSync(ruta)){
            fs.unlinkSync(ruta)
        }
    }
    
    const nombre = await subirArchivo(req.files,undefined,coleccion)
    modelo.img = nombre
    
    await modelo.save()


    res.json(modelo)
} 
const mostrarImg = async(req, res = response) =>{
    const {id, coleccion} = req.params
 
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(500).json({
                    msg:`No existe un usuario con este id ${id}`
                })

            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(500).json({
                    msg:`No existe un producto con este id ${id}`
                })

            }
            break;
    
        default:
            return res.status(500).json({msg:"Se me olvido validar esto"})
            break;
    }
    // limpiar imagenes previas
    if (modelo.img){
        // hay que borrar la imagen del servidor 
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img)
        console.log(modelo)
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }
    const pathImagen = path.join(__dirname,'../assets/OIP.jpg')
    res.sendFile(pathImagen)
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImg,

}