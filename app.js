import express from 'express'

/* Para levantar servidor - levantar la aplicacion - crea instancia*/
const app = express();

/*middleware*/
app.use(express.json()); 

const puerto = 8080;

let users = [
    {id: 1, nombre: 'karla'},
    {id: 2, nombre: 'kia'},
    {id: 3, nombre: 'kiara'},
]

/*Dice si ya esta launcheado el servidor*/
app.get('/', (req, res) => {
    res.send('Servidor funcionando')
})

/*encontrar usuario por GET request*/ 
app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) {
        return res.status(404).json(
            {mensaje: 'Usuario no encontrado'}
        );
    }
    res.status(200).json(user);
})

app.post('/api/users' ,(req, res) => { 
    const{nombre} = req.body;
    if (!nombre){
        return res.status(404).json(
            {mensaje: 'Nombre requerido'}
        );
    }
    const nuevoUsuario ={
        id: users.length + 1,
        nombre
    };
    users.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
})

/*puerto escuchado*/
app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`)
})