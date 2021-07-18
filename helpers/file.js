const path = require('path');

const { v4: uuidv4 } = require('uuid');

/**
 * Funcion que recibe un archivo y lo guarda en [../uploads/*].
 * 
 * @param {*} files El objeto [files] que vino en el requerimiento de express.
 * @param {*} allowedExtensions Una lista con las extensiones permitidas (ej: ['jpg', 'png']).
 * @param {*} folder Subdirectorio opcional donde guardar el archivo.
 * @returns Una promesa, así se puede usar con el await.
 */
const uploadFile = (files, allowedExtensions, folder='') => {
    return new Promise((resolve, reject) => {
        const { file } = files;

        const nombreCortado = file.name.split('.');
        const extension     = nombreCortado[nombreCortado.length - 1].toLowerCase();

        // Validar la extension...
        if (!allowedExtensions.includes(extension)) {
            return reject(`File extension [${ extension}] no es permitida. Extensiones permitidas: [${ allowedExtensions }]`);
        }

        const temp_file_name = uuidv4() + '.' + extension;
        uploadPath = path.join(__dirname, '../uploads/', folder, temp_file_name);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(temp_file_name);
        });
    });
}

module.exports = {
    uploadFile
}
