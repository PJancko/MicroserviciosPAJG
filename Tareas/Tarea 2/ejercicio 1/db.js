// db.js
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/agenda_db'; // conexión local

mongoose.connect(uri)
  .then(() => console.log('Conectado a la base de datos MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose;
