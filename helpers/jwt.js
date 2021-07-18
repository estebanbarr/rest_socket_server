const jwt = require('jsonwebtoken');

/**
 * Genera un JWT (JSON Web Token).
 * Ya se valido (en el model/server) que la variable [JWT_TIMEOUT] sea un numero.
 * 
 * @param payload Informacion en JSON para colocar en el payload del JWT.
 * @returns Una promesa, asi se puede usar con el await.
 */
const generateJWT = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: parseInt(process.env.JWT_TIMEOUT)
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token...')
            } else {
                resolve(token);
            }
        })
    });
}

/**
 * Valida un JWT (JSON Web Token) y extrae la informacion codificada en su payload.
 * 
 * @param token JWT a validar.
 * @returns null si el token fue invalido o informacion de negocio si el token es correcto.
 */
const verifyJWT = async(token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }

        const obj = jwt.verify(token, process.env.SECRET);

        // Hacer validaciones de negocio...
        /* ... */
        /* ... */

        return obj;
    } catch (err) {
        return null;
    }
}

module.exports = {
    generateJWT,
    verifyJWT
}
