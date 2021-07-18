const { validationResult } = require('express-validator');

/**
 *  Funcion utilizada para validar errores de formato en los request con [express] y [express-validator].
 *  Basicamente lo que hace es responder un 400 antes de llamar al controlador si hay un request "mal formado".
 * 
 * @param {*} req Objeto [request] de [express].
 * @param {*} res Objeto [response] de [express].
 * @param {*} next Callback para ejecutar el siguiente [check] de [express-validator].
 * @returns En caso de error devuelve un 400 y arma un JSON con la lista de errores para el cliente.
 */
const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validateFields
}
