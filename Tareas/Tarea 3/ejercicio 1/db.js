const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/agenda_db'; // mongo es el nombre del servicio en docker-compose

mongoose.connect(uri)
  .then(() => console.log('Conectado a la base de datos MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose;
