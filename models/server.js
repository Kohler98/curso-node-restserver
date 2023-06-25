const express = require('express')
const cors = require('cors')
class Server{
    constructor(){
        this.app = express()
        this.usuariosPath = '/api/usuarios'
        this.PORT = process.env.PORT || 3000
        
        //Midlewares : no son mas que funciones que van a añadirle otras funcionalidades al web server
        // en otras palabras es una funcion que se ejecuta cuando se levanta el servidor
        //rutas de mi applicacion

        this.middlewares()
        
        this.routes()
    }

    middlewares(){
        //cors 
        this.app.use(cors())
        
        //lectura y parseo del body
        this.app.use(express.json())
        //directorio publico
        this.app.use(express.static('public'))


    }
    routes(){

        this.app.use(this.usuariosPath, require('../routers/usuarios'))
    }

    listen(){
        this.app.listen(this.PORT, ()=>{
            console.log("Servidor corriendo en puerto", this.PORT)
        })
    }
}


module.exports = Server
