const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
class Server{
    constructor(){
        this.app = express()
        this.paths = {
            authPath : '/api/auth',
            buscar : '/api/buscar',
            categorias:'/api/categorias',
            productos:'/api/productos',
            usuariosPath : '/api/usuarios'

        }
        this.PORT = process.env.PORT
        //conectar a base de datos

        this.conectarDB()
        //Midlewares : no son mas que funciones que van a añadirle otras funcionalidades al web server
        // en otras palabras es una funcion que se ejecuta antes de llamar un controlador o seguir con la ejecucion
        //de las peticiones
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

        this.app.use(this.paths.authPath, require('../routers/auth'))
        this.app.use(this.paths.buscar, require('../routers/buscar'))
        this.app.use(this.paths.categorias, require('../routers/categorias'))
        this.app.use(this.paths.usuariosPath, require('../routers/usuarios'))
        this.app.use(this.paths.productos, require('../routers/productos'))
    }

    listen(){
        this.app.listen(this.PORT, ()=>{
            console.log("Servidor corriendo en puerto", this.PORT)
        })
    }

    async conectarDB(){
        await dbConnection()
    }
}


module.exports = Server