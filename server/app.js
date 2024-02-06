//Autor: David Jostyn Yupanqui Llamacuri
const express = require('express'); //Construye el servidor web
const sqlite3 = require('sqlite3'); //Interactua con la BD SQLite
const path = require('path'); //Gestionar rutas de archivos
const ejs = require('ejs'); //Motor de plantillas para HTML

//Creación de la app
const app = express(); 

//Establecer el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Construcción de la ruta de la BD
const dbPath = path.resolve(__dirname, 'rapimoney-db.db');

//Conexión a la BD
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        //Mensaje si es que la conexión ha fallado
        console.error('Error al abrir la base de datos', err.message);
    } else {
        //Mensaje si es que la conexión fue satisfactoria
        console.log('Conexión exitosa a la base de datos');
    }
});

//Middleware maneja datos de formularios en solicitudes POST
app.use(express.urlencoded({ extended: true }));

//Ruta principal
app.get('/', (req, res) => {
    //Obtener el filtro de la consulta
    const filtro = req.query.filtro || '';

    //Consultar datos de la BD
    db.all('SELECT * FROM clientes', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        //Renderizar la plantilla EJS y pasar datos como contexto
        res.render('index', { clientes: rows, filtro });
    });
});

//Ruta del formulario de registro
app.get('/registro', (req, res) => {
    res.render('registro');
});

//Ruta de dubida de datos desde el formulario de registro
app.post('/registro', (req, res) => {
    const { dni, nombres, apellidos, fecha_nacimiento, celular, correo, banco, numero_cci } = req.body;

    //Insertar datos en la BD
    db.run('INSERT INTO clientes (dni, nombres, apellidos, fecha_nacimiento, celular, correo, banco, numero_cci) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [dni, nombres, apellidos, fecha_nacimiento, celular, correo, banco, numero_cci], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            //Redirigir a la página principal después de la inserción
            res.redirect('/');
        });
});

//Iniciar el servidor en el puerto 3048
app.listen(3048, () => {
    //Mensaje para abrir en el navegador directamente
    console.log("Abre en tu navegador en http://localhost:3048");
});