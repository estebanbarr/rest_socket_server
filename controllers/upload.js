const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile } = require('../helpers');

const User    = require('../models/user');
const Product = require('../models/product');

const loadFile = async(req, res) => {
    try {
        const file_name = await uploadFile(req.files, ['png', 'jpg', 'jpeg', 'gif']);
    } catch (err) {
        res.status(400).json({ msg: err });
    }

    res.json({
        file_name
    });
}

const updateImgCloudinary = async(req, res) => {
    const { id, collection } = req.params;
    const { tempFilePath}    = req.files.file;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el ID: [${ id }]`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id).populate('user').populate('category');
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el ID: [${ id }]`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: `Collection [${ collection }] not supported yet..`
            });
    }

    // Limpio imagenes previas...
    try {
        if (model.img) {
            // Obtengo el ID de imagen de cloudinary...
            const secure_url_array = model.img.split('/');
            const file_name        = secure_url_array[secure_url_array.length - 1];
            const [ file_id ]      = file_name.split('.');

            // Elimino la imagen...
            /* await */ cloudinary.uploader.destroy(file_id);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Error interno al limpiar imagenes previas..'
        });
    }

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;

    await model.save();

    res.json(model);
}

const updateImg = async(req, res) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el ID: [${ id }]`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id).populate('user').populate('category');
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el ID: [${ id }]`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: `Collection [${ collection }] not supported yet..`
            });
    }

    // Limpio imagenes previas...
    try {
        if (model.img) {
            // Construyo el nombre del archivo completo (con el path)...
            const pathImg = path.join(__dirname, '../uploads', collection, model.img);

            // Valido si existe el archivo...
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Error interno al limpiar imagenes previas..'
        });
    }

    model.img = await uploadFile(req.files, ['png', 'jpg', 'jpeg', 'gif'], collection);

    await model.save();

    res.json(model);
}

const showImg = async(req, res) => {
    const { id, collection } = req.params;

    const pathNoImg = path.join(__dirname, '../assets', 'no-image.jpg');

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                // return res.status(400).json({
                //     msg: `No existe un usuario con el ID: [${ id }]`
                // });
                return res.sendFile(pathNoImg);
            }
            break;
        case 'products':
            model = await Product.findById(id).populate('user').populate('category');
            if (!model) {
                // return res.status(400).json({
                //     msg: `No existe un producto con el ID: [${ id }]`
                // });
                return res.sendFile(pathNoImg);
            }
            break;
        default:
            return res.status(500).json({
                msg: `Collection [${ collection }] not supported yet..`
            });
    }

    // Obtengo la imagen
    try {
        if (model.img) {
            // Construyo el nombre del archivo completo (con el path)...
            const pathImg = path.join(__dirname, '../uploads', collection, model.img);

            // Valido si existe el archivo...
            if (fs.existsSync(pathImg)) {
                return res.sendFile(pathImg);
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Error interno al devolver la imagen..'
        });
    }

    res.sendFile(pathNoImg);
}

module.exports = {
    loadFile,
    updateImg,
    updateImgCloudinary,
    showImg
}
