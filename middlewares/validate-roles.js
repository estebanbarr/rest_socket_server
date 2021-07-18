/**
 * Funcion que valida que un usuario tenga el/los roles pasados como argumentos.
 * Se debe validar el JWT (JSON Web Token) previamente, para tener informacion del rol en el [request] de [express].
 * 
 * @param  {...any} roles Lista de roles, de 1 a n.
 * @returns En caso de no contar con ninguno de los roles pasados, devuelve un 401 al cliente.
 *          Tambien valida que se haya validado el JWT antes de la ejecucion de este middleware.
 */
const hasRole = ( ...roles ) => {
    return (req, res, next) => {
        if (!req.tokenValidate) {
            // Tambien se podria forzar a validar el JWT pero en pos de asegurarse que uno sepa
            // lo que esta haciendo se elige no forzarlo...
            return res.status(500).json({
                msg: 'Se quiere validar el rol antes de validar el token'
            });
        }

        // Se debe especificar de donde sacar el rol de este cliente...
        const { role } = req.role;
    
        if (!roles.includes(role)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: [${ roles }]`
            });
        }

        next();
    }
}

module.exports = {
    hasRole
}
