# El Último Sono — Sistema Backend de Turnos y Reservas
Para este proyecto se uso de temática un lugar que ofrece servicios en el ámbito musical (karaoke, estudio de grabación, halls para muestras y escenarios)

## Iniciar
Para iniciar, usar npm run dev y entrar por http//localhost:8080/services
Para detener el servidor, se debe apretar CTRL + C en la terminal

## MongoDB
Para este proyecto se debe crear la base de datos en MongoDB. Para lograr el acceso, se debe agregar a la lista de IPs la IP actual (para la etapa de producción).
Para subirlo a internet y que cualquiera puede acceder, se debe configurar esta IP para lograrlo 0.0.0.0/0

## Tecnologías y componentes
- Node.js
- MongoDB Atlas
- Mongoose
- Zod
- Express Handlebars
- Socket.io
-Dotenv

## Para instalar localmente
```bash
git clone https://github.com/KatiaSotomayor/proyecto-backend-1.git
cd proyecto-backend-1
npm install
```