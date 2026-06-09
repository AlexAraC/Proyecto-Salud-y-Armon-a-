const { sql } = require('../config/db');

const obtenerProductosDestacados = async (req, res) => {

    try {

        const productos = await sql.query`

            SELECT

                Productos.id,
                Productos.nombre,
                Productos.descripcion,
                Productos.precio,
                Productos.imagen,
                Productos.categoria_id,
                Productos.destacado,

                Categorias.nombre AS categoria,

                Inventario.stock

            FROM Productos

            INNER JOIN Categorias
                ON Productos.categoria_id = Categorias.id

            INNER JOIN Inventario
                ON Productos.id = Inventario.producto_id

            WHERE Productos.destacado = 1
            AND Productos.activo = 1

        `;

        res.json(productos.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};

const agregarDestacado = async (req, res) => {

    try {

        const { id } = req.params;

        await sql.query`

            UPDATE Productos

            SET destacado = 1

            WHERE id = ${id}

        `;

        res.json({

            mensaje: 'Producto agregado a destacados'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};



const quitarDestacado = async (req, res) => {

    try {

        const { id } = req.params;

        await sql.query`

            UPDATE Productos

            SET destacado = 0

            WHERE id = ${id}

        `;

        res.json({

            mensaje: 'Producto eliminado de destacados'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};

const crearProducto = async (req, res) => {

    try {

        const {

            nombre,
            descripcion,
            precio,
            categoria_id,
            stock

        } = req.body;


   
        const imagen = req.file

            ? `/uploads/${req.file.filename}`

            : null;


 

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



        const producto_id =
            producto.recordset[0].id;


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


const obtenerProductos = async (req, res) => {

    try {

        const productos = await sql.query`

            SELECT

                Productos.id,
                Productos.nombre,
                Productos.descripcion,
                Productos.precio,
                Productos.imagen,
                Productos.destacado,

                Productos.categoria_id,

                Categorias.nombre AS categoria,

                Inventario.stock

            FROM Productos

            INNER JOIN Categorias

                ON Productos.categoria_id = Categorias.id

            INNER JOIN Inventario

                ON Productos.id = Inventario.producto_id

            WHERE Productos.activo = 1
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
                Productos.destacado,

                Productos.categoria_id,

                Categorias.nombre AS categoria,

                Inventario.stock

            FROM Productos

            INNER JOIN Categorias

                ON Productos.categoria_id = Categorias.id

            INNER JOIN Inventario

                ON Productos.id = Inventario.producto_id

            WHERE Productos.id = ${id}

            AND Productos.activo = 1
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

        await sql.query`

            UPDATE Productos

            SET activo = 0

            WHERE id = ${id}

        `;

        res.json({

            mensaje: 'Producto desactivado'

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
    eliminarProducto,
    obtenerProductosDestacados,
    agregarDestacado,
    quitarDestacado

};