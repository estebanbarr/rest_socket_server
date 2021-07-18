/**
 *  Funcion que valida que se reciban archivos en el [request] de [express].
 * 
 * @param {*} req Objeto [request] de [express].
 * @param {*} res Objeto [response] de [express].
 * @param {*} next Callback para ejecutar el siguiente [check] de [express-validator].
 * @returns En caso de error devuelve un 400 informando que no se recibio un archivo al cliente.
 */
const hasFile = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).send({
            msg: 'File to upload not found'
        });
    }

    next();
}

module.exports = {
    hasFile
}
