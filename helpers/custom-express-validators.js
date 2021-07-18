/**
 * Modelo de como debe ser una funcion de validacion [custom] para [express-validator].
 * 
 * @param {*} param El valor del parametro a validar que viene en el request...
 */
const isUpperCase = (param) => {
    const paramUpper = param.toUpperCase();

    const pp = '';
    if (paramUpper != param) {
        throw new Error(`El parametro debe estar en mayusculas y no lo esta: [${ param }]`);
    }
}

module.exports = {
    isUpperCase
}