const express = require('express');
const router = express.Router();
const Trabajador = require('../models/Trabajador');


router.get('/', async (req, res) => {
try {
const trabajadores = await Trabajador.find().sort({ createdAt: -1 });
res.json(trabajadores);
} catch (err) {
res.status(500).json({ error: 'Error al obtener trabajadores' });
}
});

router.post('/', async (req, res) => {
try {
const { nombre, apellido, cedulaIdentidad, cargo, departamento, fechaIngreso } = req.body;
if (!nombre || !apellido || !cedulaIdentidad || !cargo || !departamento || !fechaIngreso) {
return res.status(400).json({ error: 'Faltan campos obligatorios' });
}


const existing = await Trabajador.findOne({ cedulaIdentidad });
if (existing) return res.status(409).json({ error: 'Cedula ya registrada' });


const t = new Trabajador({
nombre,
apellido,
cedulaIdentidad,
cargo,
departamento,
fechaIngreso: new Date(fechaIngreso)
});


const saved = await t.save();
res.status(201).json(saved);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Error al crear trabajador' });
}
});

router.put('/:id', async (req, res) => {
try {
const { id } = req.params;
const updates = req.body;
if (updates.fechaIngreso) updates.fechaIngreso = new Date(updates.fechaIngreso);


const updated = await Trabajador.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
if (!updated) return res.status(404).json({ error: 'Trabajador no encontrado' });


res.json(updated);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Error al actualizar trabajador' });
}
});


router.delete('/:id', async (req, res) => {
try {
const { id } = req.params;
const removed = await Trabajador.findByIdAndDelete(id);
if (!removed) return res.status(404).json({ error: 'Trabajador no encontrado' });
res.json({ message: 'Trabajador eliminado' });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Error al eliminar trabajador' });
}
});


module.exports = router;