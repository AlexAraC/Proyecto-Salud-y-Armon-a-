const { sql } = require('../config/db');

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
        // IMAGEN
        // =====================================

        const imagen = req.file

            ? `/uploads/${req.file.filename}`

            : null;


        // =====================================
        // INSERTAR PRODUCTO
        // =====================================

        const producto = await sql.query`

            INSERT INTO Productos
            (
                nombre,
                descripcion,
                precio,
                categoria_id,
                imagen
            )

            OUTPUT INSERTED.id

            VALUES
            (
                ${nombre},
                ${descripcion},
                ${precio},
                ${categoria_id},
                ${imagen}
            )
        `;


        // =====================================
        // ID PRODUCTO
        // =====================================

        const producto_id =
            producto.recordset[0].id;


        // =====================================
        // INVENTARIO
        // =====================================

        await sql.query`

            INSERT INTO Inventario
            (
                producto_id,
                stock
            )

            VALUES
            (
                ${producto_id},
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
// OBTENER PRODUCTOS
// =====================================

const obtenerProductos = async (req, res) => {

    try {

        const productos = await sql.query`

            SELECT

                Productos.id,
                Productos.nombre,
                Productos.descripcion,
                Productos.precio,
                Productos.imagen,

                Categorias.nombre AS categoria,

                Inventario.stock

            FROM Productos

            INNER JOIN Categorias

                ON Productos.categoria_id = Categorias.id

            INNER JOIN Inventario

                ON Productos.id = Inventario.producto_id
        `;


        res.json(
            productos.recordset
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};


// =====================================
// OBTENER PRODUCTO POR ID
// =====================================

const obtenerProductoPorId = async (req, res) => {

    try {

        const { id } = req.params;


        const producto = await sql.query`

            SELECT

                Productos.id,
                Productos.nombre,
                Productos.descripcion,
                Productos.precio,
                Productos.imagen,

                Categorias.nombre AS categoria,

                Inventario.stock

            FROM Productos

            INNER JOIN Categorias

                ON Productos.categoria_id = Categorias.id

            INNER JOIN Inventario

                ON Productos.id = Inventario.producto_id

            WHERE Productos.id = ${id}
        `;


        res.json(
            producto.recordset[0]
        );

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
        // PRODUCTO ACTUAL
        // =====================================

        const productoActual = await sql.query`

            SELECT imagen

            FROM Productos

            WHERE id = ${id}
        `;


        // =====================================
        // IMAGEN
        // =====================================

        let imagen =
            productoActual.recordset[0].imagen;


        if (req.file) {

            imagen =
                `/uploads/${req.file.filename}`;

        }


        // =====================================
        // ACTUALIZAR PRODUCTO
        // =====================================

        await sql.query`

            UPDATE Productos

            SET

                nombre = ${nombre},
                descripcion = ${descripcion},
                precio = ${precio},
                categoria_id = ${categoria_id},
                imagen = ${imagen}

            WHERE id = ${id}
        `;


        // =====================================
        // ACTUALIZAR INVENTARIO
        // =====================================

        await sql.query`

            UPDATE Inventario

            SET stock = ${stock}

            WHERE producto_id = ${id}
        `;


        res.json({

            mensaje: 'Producto actualizado'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

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

        await sql.query`

            DELETE FROM Inventario

            WHERE producto_id = ${id}
        `;


        // =====================================
        // ELIMINAR PRODUCTO
        // =====================================

        await sql.query`

            DELETE FROM Productos

            WHERE id = ${id}
        `;


        res.json({

            mensaje: 'Producto eliminado'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};


module.exports = {

    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto

};