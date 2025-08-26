// controllers/agenda.controller.js
const Agenda = require("../models/Agenda");

// Obtener todos los registros
exports.getAll = async (req, res) => {
  try {
    const agendas = await Agenda.find();
    res.json(agendas);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener la agenda", error: err });
  }
};

// Obtener un registro por ID
exports.getOne = async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);
    if (!agenda) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }
    res.json(agenda);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener el registro", error: err });
  }
};

// Crear un nuevo registro
exports.create = async (req, res) => {
  try {
    const agenda = new Agenda(req.body);
    await agenda.save();
    res.status(201).json(agenda);
  } catch (err) {
    res.status(400).json({
      message: "Error al crear el registro",
      error: err.message || err,
    });
  }
};

// Actualizar un registro por ID
exports.update = async (req, res) => {
  try {
    const agenda = await Agenda.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!agenda) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }
    res.json(agenda);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error al actualizar el registro", error: err });
  }
};

// Eliminar un registro por ID
exports.remove = async (req, res) => {
  try {
    const agenda = await Agenda.findByIdAndDelete(req.params.id);
    if (!agenda) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }
    res.json({ message: "Registro eliminado correctamente" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar el registro", error: err });
  }
};
