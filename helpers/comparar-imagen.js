const Jimp = require('jimp');
const path = require('path')
const fs = require('fs')
const util = require('util');
const compararImagenes = async(modelo, coleccion) => {
    let ruta = false
    const readdir = util.promisify(fs.readdir);
    try {
      // Construir la ruta de la carpeta 'uploads'
      const pathImagen = path.join(__dirname, '../uploads', coleccion);
      // Obtener la lista de archivos
      const files = await readdir(pathImagen);
      // Leer la imagen del modelo+
      const imagen1 = await Jimp.read(modelo.img);
      // Recorrer la lista de archivos
      for (let file of files) {
          // Leer la imagen del archivo
          let pathAux = path.join(__dirname, '../uploads', coleccion, file);
          const imagen2 = await Jimp.read(pathAux);
        // //   Comparar las imágenes
        const distancia = await Jimp.distance(imagen1, imagen2);
        // Mostrar el resultado
      if(distancia === 0){
        return ruta = pathAux
      }
          
      }
 
    } catch (err) {
      // Manejar el error
      console.error(err);
    }
    return ruta
  }

module.exports = {
    compararImagenes
}