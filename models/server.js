const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')
 
const { socketController } = require('../sockets/controller')
class Server{
    constructor(){
        this.app = express()
        this.PORT = process.env.PORT
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server)


        this.paths = {
            authPath:     '/api/auth',
            buscar:       '/api/buscar',
            categorias:   '/api/categorias',
            productos:    '/api/productos',
            usuariosPath: '/api/usuarios',
            uploads:      '/api/uploads'

        }
        //conectar a base de datos

        this.conectarDB()
        //Midlewares : no son mas que funciones que van a añadirle otras funcionalidades al web server
        // en otras palabras es una funcion que se ejecuta antes de llamar un controlador o seguir con la ejecucion
        //de las peticiones
        //rutas de mi applicacion

        this.middlewares()
        
        this.routes()

        //sockets
        this.sockets()
    }

    middlewares(){
        //cors 
        this.app.use(cors())
        
        //lectura y parseo del body
        this.app.use(express.json())
        
        //directorio publico
        this.app.use(express.static('public'))

        // fileupload -carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));

    }
    routes(){

        this.app.use(this.paths.authPath, require('../routers/auth'))
        this.app.use(this.paths.buscar, require('../routers/buscar'))
        this.app.use(this.paths.categorias, require('../routers/categorias'))
        this.app.use(this.paths.usuariosPath, require('../routers/usuarios'))
        this.app.use(this.paths.productos, require('../routers/productos'))
        this.app.use(this.paths.uploads, require('../routers/uploads'))
    }
    sockets(){
        this.io.on('connection',socket  => socketController(socket, this.io))
    }
    listen(){
        this.server.listen(this.PORT, ()=>{
            console.log("Servidor corriendo en puerto", this.PORT)
        })
    
      
    }

    async conectarDB(){
        await dbConnection()
    }
}


module.exports = Server