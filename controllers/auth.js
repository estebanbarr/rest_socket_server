const path = require('path');
const fs   = require('fs');

const { generateJWT, uploadFile } = require('../helpers');

const login = async(req, res) => {
    const { data1, data2, ...data_remaining } = req.body;

    try {
        // Genero el JWT...
        const jwt = await generateJWT({
            data1,
            data2
        });

        // Armo el mensaje JSON de respuesta...
        res.json({ jwt });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error interno. Por favor contáctese con el administrador."
        });
    }
}

const loadFile = async(req, res) => {
    try {
        const file_name = await uploadFile(req.files, ['png', 'jpg', 'jpeg', 'gif']);
    } catch (err) {
        return res.status(400).json({ msg: err });
    }

    res.json({ file_name });
}

module.exports = { login, loadFile }
