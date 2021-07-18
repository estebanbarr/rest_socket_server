const { Router } = require('express');
const { check  } = require('express-validator');

const { validateFields, validateJWT, hasRole } = require('../middlewares/');
// const { isUpperCase                          } = require('../helpers');

// Funciones del controlador...
const { login } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    // validateJWT,
    // hasRole('ADMIN_ROLE'),
    // check('param').custom(isUpperCase),
    check('email', 'El correo es obligatorio' ).isEmail(),
    check('pass' , 'La clave es obligatoria').not().isEmpty(),
    validateFields
], login);

module.exports = router;
