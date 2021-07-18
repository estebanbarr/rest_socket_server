let user = null;
let socket = null;

const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'http://estebanapi.net/api/auth/';

// Referencias HTML...
const txtUid     = document.querySelector('#txtUid');
const txtMsg     = document.querySelector('#txtMsg');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');

const validateJWT = async() => {
    // Obtengo el token de la local storage...
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error("No hay token...");
    }

    // Pregunto al backend si el jwt es correcto...
    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });
    const { user: userBack, jwt } = await resp.json();

    localStorage.setItem('token', jwt);
    user = userBack;

    document.title = 'Bienvenido ' + user.name;
}

const connectSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online');
    });

    socket.on('disconnect', () => {
        console.log('Socket offline');
    });

    socket.on('recibir-mensaje', renderUltimos10Mensajes);
    socket.on('usuarios-activos', renderUsers);

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado', payload);
    });
}

const renderUsers = (users = []) => {
    let usersHtml = '';

    users.forEach(({ name, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${ name }</h5>
                    <span class="fs-6 text-muter">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
}

const renderUltimos10Mensajes = (mensajes = []) => {
    let mensajesHtml = '';

    mensajes.forEach(({ uid, nombre, mensaje }) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }</span>
                    <span class="fs-6 text-muter">${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHtml;
}

txtMsg.addEventListener('keypress', ({ keyCode }) => {
    const mensaje = txtMsg.value.trim();
    const uid     = txtUid.value.trim();
    if (keyCode === 13 && mensaje.length > 0) {
        socket.emit('enviar-mensaje', { mensaje, uid });
        txtMsg.value = '';
    }
});

btnSalir.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('google');
    window.location = 'index.html?logout=true';
});

const main = async() => {
    // Validar el jwt...
    await validateJWT();

    // Conecto el socket...
    await connectSocket();
}

main();
