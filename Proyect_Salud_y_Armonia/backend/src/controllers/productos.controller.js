const { sql } = require('../config/db');


// =====================================
// OBTENER PRODUCTOS
// =====================================

const obtenerProductos = async (req, res) => {

    try {

        const productos = await sql.query(`
            SELECT
                Productos.id,
                Productos.nombre,
                Productos.descripcion,
                Productos.precio,

                Categorias.nombre AS categoria,

                Inventario.stock

            FROM Productos

            INNER JOIN Categorias
            ON Productos.categoria_id = Categorias.id

            INNER JOIN Inventario
            ON Productos.id = Inventario.producto_id
        `);

        res.json(productos.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error obteniendo productos'
        });

    }

};


// =====================================
// CREAR PRODUCTO
// =====================================

const crearProducto = async (req, res) => {

    try {

        const {
            nombre,
            descripcion,
            precio,
            categoria_id,
            stock
        } = req.body;

        // =====================================
        // CREAR PRODUCTO
        // =====================================

        const producto = await sql.query`
            INSERT INTO Productos
            (
                nombre,
                descripcion,
                precio,
                categoria_id,
            )

            OUTPUT INSERTED.id

            VALUES
            (
                ${nombre},
                ${descripcion},
                ${precio},
                ${categoria_id},
            )
        `;


        const productoId = producto.recordset[0].id;

        console.log(productoId);

        // =====================================
        // CREAR INVENTARIO
        // =====================================

        await sql.query`
            INSERT INTO Inventario
            (
                producto_id,
                stock
            )

            VALUES
            (
                ${productoId},
                ${stock}
            )
        `;

        res.json({
            mensaje: 'Producto creado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// =====================================
// ACTUALIZAR PRODUCTO
// =====================================

const actualizarProducto = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nombre,
            descripcion,
            precio,
            categoria_id,
            stock
        } = req.body;

        // =====================================
        // ACTUALIZAR PRODUCTO
        // =====================================

        await sql.query(`
            UPDATE Productos

            SET
                nombre = '${nombre}',
                descripcion = '${descripcion}',
                precio = ${precio},
                categoria_id = ${categoria_id}

            WHERE id = ${id}
        `);

        // =====================================
        // ACTUALIZAR INVENTARIO
        // =====================================

        await sql.query(`
            UPDATE Inventario

            SET stock = ${stock}

            WHERE producto_id = ${id}
        `);

        res.json({
            mensaje: 'Producto actualizado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error actualizando producto'
        });

    }

};


// =====================================
// ELIMINAR PRODUCTO
// =====================================

const eliminarProducto = async (req, res) => {

    try {

        const { id } = req.params;

        // =====================================
        // ELIMINAR INVENTARIO
        // =====================================

        await sql.query(`
            DELETE FROM Inventario

            WHERE producto_id = ${id}
        `);

        // =====================================
        // ELIMINAR PRODUCTO
        // =====================================

        await sql.query(`
            DELETE FROM Productos

            WHERE id = ${id}
        `);

        res.json({
            mensaje: 'Producto eliminado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error eliminando producto'
        });

    }

};


module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};