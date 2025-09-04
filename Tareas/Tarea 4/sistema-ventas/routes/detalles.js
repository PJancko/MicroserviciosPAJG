// routes/detalles.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Detalles
 *   description: Gestión de detalles de facturas
 */

/**
 * @swagger
 * /api/detalles/{facturaId}:
 *   post:
 *     summary: Añadir un detalle a una factura
 *     tags: [Detalles]
 *     parameters:
 *       - in: path
 *         name: facturaId
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
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       201:
 *         description: Detalle agregado
 *       500:
 *         description: Error del servidor
 */
router.post('/:facturaId', async (req, res) => {
    const { facturaId } = req.params;
    const { producto_id, cantidad, precio } = req.body;

    try {
        const conn = await pool.getConnection();
        await conn.beginTransaction();

        const [result] = await conn.execute(
            `INSERT INTO detalle_facturas (factura_id, producto_id, cantidad, precio)
             VALUES (?, ?, ?, ?)`,
            [facturaId, producto_id, cantidad, precio]
        );

        const [totales] = await conn.execute(
            `SELECT SUM(subtotal) AS total FROM detalle_facturas WHERE factura_id = ?`,
            [facturaId]
        );

        await conn.execute(
            `UPDATE facturas SET total = ? WHERE id = ?`,
            [totales[0].total || 0, facturaId]
        );

        await conn.commit();
        conn.release();

        res.status(201).json({ message: 'Detalle agregado y total actualizado', detalleId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar detalle' });
    }
});

/**
 * @swagger
 * /api/detalles/{facturaId}:
 *   get:
 *     summary: Obtener detalles de una factura
 *     tags: [Detalles]
 *     parameters:
 *       - in: path
 *         name: facturaId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: producto
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de producto
 *     responses:
 *       200:
 *         description: Lista de detalles
 *       500:
 *         description: Error del servidor
 */
router.get('/:facturaId', async (req, res) => {
    const { facturaId } = req.params;
    let { page = 1, limit = 10, producto } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    try {
        let query = `
            SELECT df.id, df.producto_id, p.nombre AS producto, df.cantidad, df.precio, df.subtotal
            FROM detalle_facturas df
            JOIN productos p ON df.producto_id = p.id
            WHERE df.factura_id = ?
        `;
        const params = [facturaId];

        if (producto) {
            query += ` AND p.nombre LIKE ?`;
            params.push(`%${producto}%`);
        }

        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [detalles] = await pool.execute(query, params);

        res.json({
            page,
            limit,
            data: detalles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener detalles' });
    }
});

/**
 * @swagger
 * /api/detalles/{detalleId}:
 *   put:
 *     summary: Actualizar un detalle de factura
 *     tags: [Detalles]
 *     parameters:
 *       - in: path
 *         name: detalleId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       200:
 *         description: Detalle actualizado
 *       500:
 *         description: Error del servidor
 */
router.put('/:detalleId', async (req, res) => {
    const { detalleId } = req.params;
    const { cantidad, precio } = req.body;

    try {
        const conn = await pool.getConnection();
        await conn.beginTransaction();

        await conn.execute(
            `UPDATE detalle_facturas SET cantidad = ?, precio = ? WHERE id = ?`,
            [cantidad, precio, detalleId]
        );

        const [factura] = await conn.execute(
            `SELECT factura_id FROM detalle_facturas WHERE id = ?`,
            [detalleId]
        );
        if (factura.length === 0) return res.status(404).json({ error: 'Detalle no encontrado' });

        const facturaId = factura[0].factura_id;

        const [totales] = await conn.execute(
            `SELECT SUM(subtotal) AS total FROM detalle_facturas WHERE factura_id = ?`,
            [facturaId]
        );

        await conn.execute(
            `UPDATE facturas SET total = ? WHERE id = ?`,
            [totales[0].total || 0, facturaId]
        );

        await conn.commit();
        conn.release();

        res.json({ message: 'Detalle actualizado y total recalculado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar detalle' });
    }
});

/**
 * @swagger
 * /api/detalles/{detalleId}:
 *   delete:
 *     summary: Eliminar un detalle de factura
 *     tags: [Detalles]
 *     parameters:
 *       - in: path
 *         name: detalleId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Detalle eliminado
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:detalleId', async (req, res) => {
    const { detalleId } = req.params;

    try {
        const conn = await pool.getConnection();
        await conn.beginTransaction();

        const [detalle] = await conn.execute(
            `SELECT factura_id FROM detalle_facturas WHERE id = ?`,
            [detalleId]
        );
        if (detalle.length === 0) return res.status(404).json({ error: 'Detalle no encontrado' });

        const facturaId = detalle[0].factura_id;

        await conn.execute(
            `DELETE FROM detalle_facturas WHERE id = ?`,
            [detalleId]
        );

        const [totales] = await conn.execute(
            `SELECT SUM(subtotal) AS total FROM detalle_facturas WHERE factura_id = ?`,
            [facturaId]
        );

        await conn.execute(
            `UPDATE facturas SET total = ? WHERE id = ?`,
            [totales[0].total || 0, facturaId]
        );

        await conn.commit();
        conn.release();

        res.json({ message: 'Detalle eliminado y total actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar detalle' });
    }
});

module.exports = router;
