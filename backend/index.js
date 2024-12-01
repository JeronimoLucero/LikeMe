const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();


app.use(cors());

app.use(express.json());


const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',  
  password: '123123john',  
  database: 'likeme', 
});

client.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => console.error('Error al conectar con la base de datos', err.stack));


  app.get('/posts', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM posts');
      res.status(200).json(result.rows); 
    } catch (err) {
      console.error('Error al ejecutar la consulta', err.stack);
      res.status(500).send('Error al obtener los registros');
    }
  });
  



  app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion } = req.body;
  
    if (!titulo || !img || !descripcion) {
      return res.status(400).send('Faltan campos obligatorios');
    }
  
    const query = {
      text: 'INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING *',
      values: [titulo, img, descripcion],
    };
  
    try {
      const result = await client.query(query);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al insertar el registro', err.stack);
      res.status(500).send('Error al insertar el registro');
    }
  });
  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
