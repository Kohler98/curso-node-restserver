const {Schema, model} =  require("mongoose")

const UsuariosSchema = Schema({
    
    nombre:{
        type:String,
        required:[true, "El nombre es Obligatorio"]
    },
    correo:{
        type:String,
        required:[true, "El correo es Obligatorio"],
        unique:true
    },
    password:{
        type:String,
        required:[true, "La contraseña es Obligatoria"]
    
    },
    img:{
        type:String
    },
    rol:{
        type:String,
        required:true,
        enum:['ADMIN_ROL', 'USER_ROL', 'VENTAS_ROL']
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    },
    
    
})
UsuariosSchema.methods.toJSON = function(){
    const {__v,password,_id,...usuario} = this.toObject()
    usuario.uid = _id
    return usuario
}
module.exports = model("Usuario", UsuariosSchema)