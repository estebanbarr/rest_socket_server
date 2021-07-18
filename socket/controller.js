const { verifyJWT } = require('../helpers');

const socketController = async(socket, io) => {
    // Busca en el header del cliente el parametro [x-token] para validar el JWT...
    const obj = await verifyJWT(socket.handshake.headers['x-token']);
    if (!obj) {
        // Si no lo pudo validar desconecta el socket...
        return socket.disconnect();
    }

    // Mensaje informativo...
    console.log(`Se conecto el usuario [${ user.name }] con id de socket [${ socket.id }]...`);

    // Opcional: Persistir el cliente conectado...

    // Opcional: Informo la novedad del nuevo cliente conectado...
    io.emit('update-clients', chatMensajes.usuariosArr);

    // Opcional: Actualizo recursos en mi socket...
    socket.emit('update-state', { state: obj.state });

    // Lo conecto a una sala especial para que otros clientes puedan conectarse con este de manera "privada"...
    socket.join(obj.id);

    // Accion a realizar cuando el cliente se desconecta...
    socket.on('disconnect', () => {
        // Opcional: Informo la novedad de la desconexion del cliente...
        io.emit('update-clients', chatMensajes.usuariosArr);
    });

    // Ejemplo...
    socket.on('action', (payload, callback) => {
        if (payload.idTo) {
            // Mensaje privado...
            socket.to(payload.idTo).emit('private-message', {
                from: obj.id,
                message: payload.message
            });
        } else {
            // Mensaje global...
            io.emit('public-message', {
                from: obj.id,
                message: payload.message
            });
        }

        // Ejecuto el callback, es una funcion que se ejecuta solo en el cliente que origino esta llamada
        payload.ok = true;
        callback(payload);
    });
}

module.exports = {
    socketController
}
