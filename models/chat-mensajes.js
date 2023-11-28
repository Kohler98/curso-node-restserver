class Mensaje {
    constructor(uid, nombre, mensaje, privado) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
        this.privado = false;
    }
}

class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(0, 10);
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values(this.usuarios);
    }

    enviarMensaje(uid, nombre, mensaje, privado = false) {
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje, privado)
        );
    }

    conectarUsuario(usuario) {
        this.usuarios[usuario.id] = usuario;
    }

    desconectarUsuario(id) {
        delete this.usuarios[id];
    }
}

module.exports = ChatMensajes