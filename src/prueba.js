import { ServiceManager } from './managers/ServiceManager.js';

const manager = new ServiceManager();

console.log('Todos:', manager.getServices());
console.log('ID 1:', manager.getServiceById(1));
console.log('ID 99:', manager.getServiceById(99));

const nuevo = manager.addService({
    name: 'Clase de yoga',
    description: 'Clase individual de una hora',
    duration: 60,
    price: 9500,
    category: 'bienestar',
    available: false
});
console.log('Agregado:', nuevo);

try {
    manager.addService({ name: 'Incompleto' });
} catch (error) {
    console.log('Error esperado:', error.message);
}

console.log('Actualizado:', manager.updateService(1, { id: 999, price: 9000 }));
console.log('Eliminado:', manager.deleteService(2));
console.log('Eliminar inexistente:', manager.deleteService(99));