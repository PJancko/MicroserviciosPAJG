import { Router } from "express";
import pool from "../db.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - ci
 *         - nombres
 *         - apellidos
 *         - sexo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del cliente
 *         ci:
 *           type: string
 *         nombres:
 *           type: string
 *         apellidos:
 *           type: string
 *         sexo:
 *           type: string
 *           enum: [M, F]
 *       example:
 *         id: 1
 *         ci: "1234567"
 *         nombres: "Juan"
 *         apellidos: "Pérez"
 *         sexo: "M"
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clientes WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 */
router.post("/", async (req, res) => {
  try {
    const { ci, nombres, apellidos, sexo } = req.body;
    const [result] = await pool.query(
      "INSERT INTO clientes (ci, nombres, apellidos, sexo) VALUES (?, ?, ?, ?)",
      [ci, nombres, apellidos, sexo]
    );
    res.status(201).json({ id: result.insertId, ci, nombres, apellidos, sexo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.put("/:id", async (req, res) => {
  try {
    const { ci, nombres, apellidos, sexo } = req.body;
    const [result] = await pool.query(
      "UPDATE clientes SET ci = ?, nombres = ?, apellidos = ?, sexo = ? WHERE id = ?",
      [ci, nombres, apellidos, sexo, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM clientes WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
