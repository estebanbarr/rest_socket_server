//const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        // await mongoose.connect(process.env.MONGODB_CNN, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useCreateIndex: true,
        //     useFindAndModify: false
        // });

        console.log('Conexión exitosa a la base de datos...');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión a la base de datos...');
    }
}

module.exports = {
    connectDB
}
