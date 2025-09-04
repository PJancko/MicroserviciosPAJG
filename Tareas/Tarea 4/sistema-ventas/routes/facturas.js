import { Router } from "express";
import pool from "../db.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Factura:
 *       type: object
 *       required:
 *         - fecha
 *         - cliente_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado de la factura
 *         fecha:
 *           type: string
 *           format: date
 *         cliente_id:
 *           type: integer
 *         total:
 *           type: number
 *           format: float
 *       example:
 *         id: 1
 *         fecha: "2025-09-04"
 *         cliente_id: 1
 *         total: 1500.50
 */

/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Obtener todas las facturas
 *     tags: [Facturas]
 *     responses:
 *       200:
 *         description: Lista de facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM facturas");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /facturas/{id}:
 *   get:
 *     summary: Obtener una factura por ID
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Factura'
 *       404:
 *         description: Factura no encontrada
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM facturas WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Factura no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /facturas/cliente/{cliente_id}:
 *   get:
 *     summary: Obtener todas las facturas de un cliente
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de facturas del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 *       404:
 *         description: Cliente sin facturas
 */
router.get("/cliente/:cliente_id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM facturas WHERE cliente_id = ?", [req.params.cliente_id]);
    if (rows.length === 0) return res.status(404).json({ message: "No se encontraron facturas para este cliente" });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /facturas:
 *   post:
 *     summary: Crear una nueva factura
 *     tags: [Facturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha
 *               - cliente_id
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *               cliente_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 */
router.post("/", async (req, res) => {
  try {
    const { fecha, cliente_id } = req.body;
    const [result] = await pool.query(
      "INSERT INTO facturas (fecha, cliente_id, total) VALUES (?, ?, 0)",
      [fecha, cliente_id]
    );
    res.status(201).json({ id: result.insertId, fecha, cliente_id, total: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /facturas/{id}:
 *   put:
 *     summary: Actualizar una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *               cliente_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Factura actualizada correctamente
 *       404:
 *         description: Factura no encontrada
 */
router.put("/:id", async (req, res) => {
  try {
    const { fecha, cliente_id } = req.body;
    const [result] = await pool.query(
      "UPDATE facturas SET fecha = ?, cliente_id = ? WHERE id = ?",
      [fecha, cliente_id, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Factura no encontrada" });
    res.json({ message: "Factura actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /facturas/{id}:
 *   delete:
 *     summary: Eliminar una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura eliminada correctamente
 *       404:
 *         description: Factura no encontrada
 */
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM facturas WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Factura no encontrada" });
    res.json({ message: "Factura eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
