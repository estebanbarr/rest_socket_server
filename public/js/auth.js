const searchParams = new URLSearchParams(window.location.search);

let logout = false;
if (searchParams.has('logout')) {
    logout = true;
}

const form = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'http://estebanapi.net/api/auth/';

form.addEventListener('submit', event => {
    // Para sacarle el comportamiento default al formulario...
    event.preventDefault();

    const formData = {};

    for (let e of form.elements) {
        if (e.name.length > 0) {
            formData[e.name] = e.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(resp => resp.json())
    .then(({ msg, jwt }) => {
        if (msg) {
            return console.error(msg);
        }

        if (!logout) {
            localStorage.setItem('token', jwt);
            window.location = 'chat.html';
        } else {
            window.location = 'index.html';
        }
    })
    .catch(err => {
        console.log(err);
    });
});

function onSignIn(googleUser) {
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;

    const data = { id_token };
    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( data )
    })
    .then(resp => resp.json())
    .then(({ jwt }) => {
        if (!logout) {
            localStorage.setItem('token', jwt);
            localStorage.setItem('google', true);
            window.location = 'chat.html';
        } else {
            signOut();
            window.location = 'index.html';
        }
    })
    .catch(console.log);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
