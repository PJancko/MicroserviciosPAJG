const express = require('express');
const cors = require('cors');
const path = require('path');
const agendaRoutes = require('./routes/agenda.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/agenda', agendaRoutes);

app.get('/', (req, res) => {
  res.render('agenda');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
