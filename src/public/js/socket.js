const socket = io();

const list = document.getElementById('services-list');
const emptyMessage = document.getElementById('empty-message');
const statusText = document.getElementById('connection-status');

const formatPrice = value =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value || 0);

const renderServices = services => {
    list.innerHTML = '';
    emptyMessage.hidden = services.length > 0;

    services.forEach(service => {
        const card = document.createElement('article');
        card.className = 'card';

        const title = document.createElement('h3');
        title.textContent = service.name;

        const description = document.createElement('p');
        description.textContent = service.description;

        const details = document.createElement('ul');
        [
            `Duración: ${service.duration} min`,
            `Precio: ${formatPrice(service.price)}`,
            `Categoría: ${service.category}`,
            `Disponible: ${service.available ? 'Sí' : 'No'}`
        ].forEach(text => {
            const item = document.createElement('li');
            item.textContent = text;
            details.appendChild(item);
        });

        card.append(title, description, details);
        list.appendChild(card);
    });
};

socket.on('connect', () => {
    statusText.textContent = 'Conectado en tiempo real';
});

socket.on('disconnect', () => {
    statusText.textContent = 'Desconectado, reintentando…';
});


socket.on('servicesUpdated', renderServices);