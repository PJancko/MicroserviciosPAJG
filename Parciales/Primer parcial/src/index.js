require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const trabajadorRoutes = require('./routes/trabajador');


const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trabajadores';


app.use(cors());
app.use(express.json());


app.use('/trabajador', trabajadorRoutes);


app.get('/', (req, res) => res.send('API de Trabajadores funcionando'));


mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('Conectado a MongoDB');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
console.error('Error conectando a MongoDB:', err.message);
process.exit(1);
});