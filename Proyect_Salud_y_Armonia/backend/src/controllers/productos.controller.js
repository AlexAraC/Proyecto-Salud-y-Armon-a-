const { sql } = require('../config/db');


// =====================================
// OBTENER PRODUCTOS
// =====================================

const obtenerProductos = async (req, res) => {

    try {

        // =====================================
        // OBTENER FILTROS
        // =====================================

        const {
            nombre,
            descripcion,
            precioMin,
            precioMax
        } = req.query;


        // =====================================
        // QUERY BASE
        // =====================================

        let query = `

            SELECT
                Productos.id,
                Productos.nombre,
                Productos.descripcion,
                Productos.precio,
                Productos.destacado,

                Categorias.nombre AS categoria,

                Inventario.stock

            FROM Productos

            INNER JOIN Categorias
            ON Productos.categoria_id = Categorias.id

            INNER JOIN Inventario
            ON Productos.id = Inventario.producto_id

            WHERE 1 = 1
        `;


        // =====================================
        // FILTRO NOMBRE
        // =====================================

        if (nombre) {

            query += `
                AND Productos.nombre
                LIKE '%${nombre}%'
            `;

        }


        // =====================================
        // FILTRO DESCRIPCIÓN
        // =====================================

        if (descripcion) {

            query += `
                AND Productos.descripcion
                LIKE '%${descripcion}%'
            `;

        }


        // =====================================
        // PRECIO MÍNIMO
        // =====================================

        if (precioMin) {

            query += `
                AND Productos.precio >= ${precioMin}
            `;

        }


        // =====================================
        // PRECIO MÁXIMO
        // =====================================

        if (precioMax) {

            query += `
                AND Productos.precio <= ${precioMax}
            `;

        }


        // =====================================
        // EJECUTAR QUERY
        // =====================================

        const productos = await sql.query(query);


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({

            mensaje: 'Productos obtenidos correctamente',

            productos: productos.recordset

        });

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

const marcarProductoDestacado = async (req, res) => {

    try {

        const { id } = req.params;

        await sql.query`

            UPDATE Productos

            SET destacado = 1

            WHERE id = ${id}
        `;

        res.json({
            mensaje: 'Producto marcado como destacado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const desmarcarProductoDestacado = async (req, res) => {

    try {

        const { id } = req.params;


        await sql.query`

            UPDATE Productos

            SET destacado = 0

            WHERE id = ${id}
        `;


        res.json({

            mensaje: 'Producto desmarcado como destacado'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};
const obtenerProductosMarcados = async (req, res) => {

    try { 

        const destacados = await sql.query`
        SELECT * FROM Productos

        WHERE destacado = 1
        
        `
        res.json({
            mensaje: 'Productos destacados cargados correctamente',
            Productos: destacados.recordset
        })

    } catch (error){

        console.log(error);

        res.status(500).json({
            mensaje: error.message
        })



    }

}




module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    marcarProductoDestacado,
    desmarcarProductoDestacado,
    obtenerProductosMarcados
};