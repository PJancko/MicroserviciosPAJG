import { Router } from "express";
import pool from "../db.js";

const router = Router();

/**
 * Función auxiliar para recalcular el total de una factura
 */
async function recalcularTotal(factura_id) {
  await pool.query(
    `UPDATE facturas f
     SET f.total = (
       SELECT IFNULL(SUM(df.subtotal), 0)
       FROM detalle_facturas df
       WHERE df.factura_id = f.id
     )
     WHERE f.id = ?`,
    [factura_id]
  );
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DetalleFactura:
 *       type: object
 *       required:
 *         - factura_id
 *         - producto_id
 *         - cantidad
 *         - precio
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del detalle
 *         factura_id:
 *           type: integer
 *         producto_id:
 *           type: integer
 *         cantidad:
 *           type: integer
 *         precio:
 *           type: number
 *           format: float
 *         subtotal:
 *           type: number
 *           format: float
 *       example:
 *         id: 1
 *         factura_id: 1
 *         producto_id: 2
 *         cantidad: 3
 *         precio: 25.00
 *         subtotal: 75.00
 */

/**
 * @swagger
 * /detalles:
 *   post:
 *     summary: Añadir un detalle a una factura
 *     tags: [Detalles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFactura'
 *     responses:
 *       201:
 *         description: Detalle agregado correctamente
 */
router.post("/", async (req, res) => {
  try {
    const { factura_id, producto_id, cantidad, precio } = req.body;

    const [result] = await pool.query(
      "INSERT INTO detalle_facturas (factura_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)",
      [factura_id, producto_id, cantidad, precio]
    );

    // Recalcular total
    await recalcularTotal(factura_id);

    res.status(201).json({ id: result.insertId, factura_id, producto_id, cantidad, precio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /detalles/factura/{factura_id}:
 *   get:
 *     summary: Obtener todos los detalles de una factura
 *     tags: [Detalles]
 *     parameters:
 *       - in: path
 *         name: factura_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Lista de detalles de la factura
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetalleFactura'
 */
router.get("/factura/:factura_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT df.*, p.nombre as producto
       FROM detalle_facturas df
       JOIN productos p ON df.producto_id = p.id
       WHERE df.factura_id = ?`,
      [req.params.factura_id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "No hay detalles para esta factura" });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /detalles/{id}:
 *   put:
 *     summary: Actualizar un detalle de factura
 *     tags: [Detalles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFactura'
 *     responses:
 *       200:
 *         description: Detalle actualizado correctamente
 *       404:
 *         description: Detalle no encontrado
 */
router.put("/:id", async (req, res) => {
  try {
    const { factura_id, producto_id, cantidad, precio } = req.body;

    const [result] = await pool.query(
      "UPDATE detalle_facturas SET factura_id = ?, producto_id = ?, cantidad = ?, precio = ? WHERE id = ?",
      [factura_id, producto_id, cantidad, precio, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Detalle no encontrado" });

    // Recalcular total
    await recalcularTotal(factura_id);

    res.json({ message: "Detalle actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /detalles/{id}:
 *   delete:
 *     summary: Eliminar un detalle de factura
 *     tags: [Detalles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle
 *     responses:
 *       200:
 *         description: Detalle eliminado correctamente
 *       404:
 *         description: Detalle no encontrado
 */
router.delete("/:id", async (req, res) => {
  try {
    // obtener factura antes de borrar
    const [detalle] = await pool.query("SELECT factura_id FROM detalle_facturas WHERE id = ?", [req.params.id]);
    if (detalle.length === 0) return res.status(404).json({ message: "Detalle no encontrado" });

    const factura_id = detalle[0].factura_id;

    const [result] = await pool.query("DELETE FROM detalle_facturas WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Detalle no encontrado" });

    // Recalcular total
    await recalcularTotal(factura_id);

    res.json({ message: "Detalle eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
