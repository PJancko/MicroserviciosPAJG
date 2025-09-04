import { Router } from "express";
import pool from "../db.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *         - marca
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del producto
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *         marca:
 *           type: string
 *         stock:
 *           type: integer
 *       example:
 *         id: 1
 *         nombre: "Laptop"
 *         descripcion: "Laptop Gamer 16GB RAM"
 *         marca: "Dell"
 *         stock: 10
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    const [result] = await pool.query(
      "INSERT INTO productos (nombre, descripcion, marca, stock) VALUES (?, ?, ?, ?)",
      [nombre, descripcion, marca, stock]
    );
    res.status(201).json({ id: result.insertId, nombre, descripcion, marca, stock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    const [result] = await pool.query(
      "UPDATE productos SET nombre = ?, descripcion = ?, marca = ?, stock = ? WHERE id = ?",
      [nombre, descripcion, marca, stock, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
