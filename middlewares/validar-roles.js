const { response } = require("express");

const esAdminRole = (req,res =response, next)=>{
    if(!req.usuario){
        return res.status(500).json({
            msg:'Se quiere verificar el rol sin validar el token primero'
        })
    }
    const{rol,nombre} = req.usuario
 
    if (rol!= "ADMIN_ROLE"){
        return res.status(500).json({
            msg:`${nombre} no es administrador - No puede hacer esto`
        })
        
   }

    next()
} 
//los tres puntos es como el args en python recibe cuantos argumentos les pase y los convierte en un arreglo
const tieneRole = (...roles) =>{
    return (req,res =response) =>{
        if(!req.usuario){
            return res.status(500).json({
                msg:'Se quiere verificar el rol sin validar el token primero'
            })
        }
        if (!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${roles}`
            })
            
        }
        next()
    }
}
module.exports = {
    esAdminRole,
    tieneRole
}