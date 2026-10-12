const socket = io();

const status = document.getElementById('estado-conexion');
const list = document.getElementById('lista-servicios');

const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text; 
    return element;
};

const createCard = service => {
    const card = createElement('article', service.available ? 'tarjeta-servicio' : 'tarjeta-servicio no-disponible');

    const meta = createElement('div', 'tarjeta-datos');
    meta.append(
        createElement('span', 'precio', `$${service.price}`),
        createElement('span', 'duracion', `${service.duration} min`)
    );

    const state = createElement(
        'p',
        service.available ? 'disponibilidad disponible' : 'disponibilidad no-disponible',
        service.available ? '● Disponible' : '○ No disponible'
    );

    // Este botón lo atiende manage.js: cambia la disponibilidad llamando a la API
    const toggle = createElement(
        'button',
        'boton boton-chico boton-secundario',
        service.available ? 'Marcar no disponible' : 'Marcar disponible'
    );
    toggle.type = 'button';
    toggle.dataset.api = `/api/services/${service._id}`;
    toggle.dataset.method = 'PUT';
    toggle.dataset.body = JSON.stringify({ available: !service.available });

    card.append(
        createElement('div', 'onda'),
        createElement('span', 'etiqueta', service.category),
        createElement('h3', '', service.name),
        createElement('p', 'descripcion', service.description),
        meta,
        state,
        toggle
    );
    return card;
};

const renderServices = services => {
    if (services.length === 0) {
        list.replaceChildren(createElement('p', 'vacio', 'No hay servicios cargados todavía.'));
        return;
    }
    list.replaceChildren(...services.map(createCard));
};

socket.on('connect', () => {
    status.textContent = '● Conectado en tiempo real';
});

socket.on('disconnect', () => {
    status.textContent = '○ Desconectado, reintentando…';
});

socket.on('servicesUpdated', services => {
    renderServices(services);
});
