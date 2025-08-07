const db = require('../db');

exports.getAll = (req, res) => {
  db.query('SELECT * FROM agenda', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getOne = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM agenda WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

exports.create = (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  db.query(
    'INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)',
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, ...req.body });
    }
  );
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  db.query(
    'UPDATE agenda SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, celular = ?, correo = ? WHERE id = ?',
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ id, ...req.body });
    }
  );
};

exports.remove = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM agenda WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Registro eliminado' });
  });
};
