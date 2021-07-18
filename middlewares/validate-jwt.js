const jwt = require('jsonwebtoken');

const { verifyJWT } = require('../helpers');

/**
 * Funcion que valida que haya venido el JWT (JSON Web Token) en los headers del [request] de [express].
 * 
 * @param {*} req Objeto [request] de [express].
 * @param {*} res Objeto [response] de [express].
 * @param {*} next Callback para ejecutar el siguiente [check] de [express-validator]
 * @returns En caso de error devuelve un 401 con una descripcion de error al cliente.
 *          En caso de exito opcionalmente guarda informacion extra en el [request] de [express] para pasarsela al controlador.
 */
const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Token required not found'
        });
    }

    try {
        // Valido el token y obtengo la informacion que deberia estar en el payload...
        const { data1, data2, ...remainingData } = verifyJWT(token);

        // Guardo en el [request] un flag indicando que valide el JWT
        // es solo para comodidad en ciertos casos, como medida de seguridad
        // no deberias confiar en este flag...
        req.tokenValidate = true;

        // Guardo informacion opcional para pasarsela al controlador...
        req.data1 = data1;
        req.data2 = data2;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        });
    }
}

module.exports = {
    validateJWT
}
