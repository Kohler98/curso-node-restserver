const { response } = require("express");
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req, res = response) =>{
    const {correo, password} = req.body

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({correo})
        
        if(!usuario){
            return res.status(400).json({
                msg:'El usuario / password no son validos'
            })
        }
        
        //si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'El usuario / password no son validos - estado  false'
                
            })
        }
        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password,usuario.password)
     
        if (!validPassword){
            return res.status(400).json({
                msg:'El usuario / password no son validos - password',
                validPassword
            })

        }
        //generar el jwt
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token

        })    
    } catch (error) {

        console.log(error)
        return res.status().json({
            msg:'Hable con el administrador'
        })
    }
    
}
const googleSignIn = async(req,res=response) =>{
    const {id_token} = req.body
    try{
 
        const {correo, nombre,img} = await googleVerify(id_token)
        let usuario = await Usuario.findOne({correo})

        if (!usuario){
            //tengo que crearlo

            const data = {
                nombre,
                correo,
                password:':P',
                img,
                rol:"USER_ROL",
                google:true
            }
            usuario = new Usuario(data)
            await usuario.save()
        }

        // si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrado, usuario bloqueado',
            })
        }

        // generar el jwt

        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
        
    }catch(error){
       console.log(error)
        // res.status(400).json({
        //     ok:false,
        //     msg:'El token no se pudo verificar',
 
        // })
     
    }
}
const renovarToken = async(req, res) => {
    const { usuario } = req;

    // Check the JWT
    const token = await generarJWT(usuario.id);
    
    res.json({
        usuario,
        token
    });
}
module.exports = {
    login,
    googleSignIn,
    renovarToken
}