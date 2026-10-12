const toast = (message, type = 'ok') => {
        const area = document.getElementById('area-avisos');
    const item = document.createElement('div');
    item.className = `aviso aviso-${type}`;
    item.textContent = message;
    area.appendChild(item);
    setTimeout(() => item.remove(), 3500);
};

const TOAST_KEY = 'pendingToast';

try {
    const pending = sessionStorage.getItem(TOAST_KEY);
    if (pending) {
        sessionStorage.removeItem(TOAST_KEY);
        toast(pending);
    }
} catch {

}

const callApi = async (method, url, body) => {
    const options = { method, headers: {} };

    if (body !== undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const details = Array.isArray(data.errors) ? data.errors.map(error => error.message).join(' · ') : '';
        throw new Error(details || data.message || 'Ocurrió un error inesperado');
    }
    return data;
};

const formToJson = form => {
    const body = {};

    for (const field of form.elements) {
        if (!field.name) continue;

        if (field.type === 'checkbox') {
            body[field.name] = field.checked;
        } else if (field.value.trim() !== '') {
            body[field.name] = field.type === 'number' ? Number(field.value) : field.value.trim();
        }
    }
    return body;
};

const buildUrl = (url, body) =>
    url.replace(/:(\w+)/g, (_, name) => {
        const value = body[name];
        delete body[name];
        return encodeURIComponent(value ?? '');
    });

const send = async (element, method, url, body) => {
    if (element.dataset.confirm && !confirm(element.dataset.confirm)) return;

    const buttons = element.matches('form') ? element.querySelectorAll('button') : [element];
    buttons.forEach(button => { button.disabled = true; });

    try {
        await callApi(method, url, body);
        const message = element.dataset.ok ?? 'Listo';
        const reload = element.dataset.reload !== undefined;

        if (reload || element.dataset.redirect) {
            try {
                sessionStorage.setItem(TOAST_KEY, message);
            } catch {
            }
            if (element.dataset.redirect) location.href = element.dataset.redirect;
            else location.reload();
        } else {
            toast(message);
            buttons.forEach(button => { button.disabled = false; });
        }
    } catch (error) {
        toast(error.message, 'error');
        buttons.forEach(button => { button.disabled = false; });
    }
};

document.addEventListener('submit', event => {
    const form = event.target.closest('form[data-api]');
    if (!form) return;

    event.preventDefault();
    const body = formToJson(form);
    send(form, form.dataset.method, buildUrl(form.dataset.api, body), body);
});

document.addEventListener('click', event => {
    const button = event.target.closest('button[data-api]');
    if (!button) return;

    const body = button.dataset.body ? JSON.parse(button.dataset.body) : undefined;
    send(button, button.dataset.method, button.dataset.api, body);
});
