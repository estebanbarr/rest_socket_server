const validateFields = require('./validate-fields');
const validateFile   = require('./validate-file');
const validateJWT    = require('./validate-jwt');
const validateRoles  = require('./validate-roles');

module.exports = {
    ...validateFields,
    ...validateFile,
    ...validateJWT,
    ...validateRoles
}
