const { sql } = require('../config/db');


// =====================================
// VALIDACIONES
// =====================================

const validarNombre = (nombre) => {

    if (!nombre || typeof nombre !== 'string') {

        return 'El nombre es obligatorio';

    }

    const nombreTrim = nombre.trim();

    if (nombreTrim.length === 0) {

        return 'El nombre no puede estar vacío';

    }

    if (nombreTrim.length > 200) {

        return 'El nombre no puede tener más de 200 caracteres';

    }

    return null;

};

const validarPrecio = (precio) => {

    if (precio === undefined || precio === null) {

        return 'El precio es obligatorio';

    }

    if (!Number.isFinite(precio) || precio <= 0) {

        return 'El precio debe ser un número mayor a 0';

    }

    return null;

};

const validarStock = (stock) => {

    if (stock === undefined || stock === null) {

        return 'El stock es obligatorio';

    }

    if (!Number.isInteger(stock) || stock < 0) {

        return 'El stock debe ser un número entero mayor o igual a 0';

    }

    return null;

};

const validarCategoria = async (categoria_id) => {

    if (!Number.isInteger(categoria_id) || categoria_id <= 0) {

        return 'La categoría no es válida';

    }

    const existe = await sql.query`

        SELECT id FROM Categorias WHERE id = ${categoria_id}
    `;

    if (existe.recordset.length === 0) {

        return 'La categoría especificada no existe';

    }

    return null;

};


// =====================================
// OBTENER PRODUCTOS DESTACADOS
// =====================================

const obtenerProductosDestacados = async (req, res, next) => {

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

        next(error);

    }

};


// =====================================
// AGREGAR A DESTACADOS
// =====================================

const agregarDestacado = async (req, res, next) => {

    try {

        const { id } = req.params;

        const resultado = await sql.query`

            UPDATE Productos

            SET destacado = 1

            WHERE id = ${id}
              AND activo = 1
        `;

        if (resultado.rowsAffected[0] === 0) {

            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });

        }

        res.json({
            mensaje: 'Producto agregado a destacados'
        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// QUITAR DE DESTACADOS
// =====================================

const quitarDestacado = async (req, res, next) => {

    try {

        const { id } = req.params;

        const resultado = await sql.query`

            UPDATE Productos

            SET destacado = 0

            WHERE id = ${id}
              AND activo = 1
        `;

        if (resultado.rowsAffected[0] === 0) {

            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });

        }

        res.json({
            mensaje: 'Producto eliminado de destacados'
        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// CREAR PRODUCTO
// =====================================

const crearProducto = async (req, res, next) => {

    const transaction = new sql.Transaction();

    try {

        const {
            nombre,
            descripcion,
            precio,
            categoria_id,
            stock
        } = req.body;

        // =====================================
        // VALIDAR NOMBRE
        // =====================================

        const errorNombre = validarNombre(nombre);

        if (errorNombre) {

            return res.status(400).json({ mensaje: errorNombre });

        }

        // =====================================
        // VALIDAR PRECIO
        // =====================================

        const errorPrecio = validarPrecio(precio);

        if (errorPrecio) {

            return res.status(400).json({ mensaje: errorPrecio });

        }

        // =====================================
        // VALIDAR STOCK
        // =====================================

        const errorStock = validarStock(stock);

        if (errorStock) {

            return res.status(400).json({ mensaje: errorStock });

        }

        // =====================================
        // VALIDAR CATEGORÍA
        // =====================================

        const errorCategoria = await validarCategoria(categoria_id);

        if (errorCategoria) {

            return res.status(400).json({ mensaje: errorCategoria });

        }

        // =====================================
        // IMAGEN
        // =====================================

        const imagen = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        // =====================================
        // INICIAR TRANSACCIÓN
        // =====================================

        await transaction.begin();

        // =====================================
        // INSERTAR PRODUCTO
        // =====================================

        const producto = await transaction.request().query`

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
                ${nombre.trim()},
                ${descripcion},
                ${precio},
                ${categoria_id},
                ${imagen}
            )
        `;

        const producto_id = producto.recordset[0].id;

        // =====================================
        // INSERTAR INVENTARIO
        // =====================================

        await transaction.request().query`

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

        // =====================================
        // CONFIRMAR TRANSACCIÓN
        // =====================================

        await transaction.commit();

        res.json({
            mensaje: 'Producto creado'
        });

    } catch (error) {

        try {
            await transaction.rollback();
        } catch (rollbackError) {
            // Ignorar si ya fue revertida
        }

        next(error);

    }

};


// =====================================
// OBTENER PRODUCTOS
// =====================================

const obtenerProductos = async (req, res, next) => {

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

        res.json(productos.recordset);

    } catch (error) {

        next(error);

    }

};


// =====================================
// OBTENER PRODUCTO POR ID
// =====================================

const obtenerProductoPorId = async (req, res, next) => {

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

        if (producto.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });

        }

        res.json(producto.recordset[0]);

    } catch (error) {

        next(error);

    }

};


// =====================================
// ACTUALIZAR PRODUCTO
// =====================================

const actualizarProducto = async (req, res, next) => {

    const transaction = new sql.Transaction();

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
        // VALIDAR NOMBRE
        // =====================================

        const errorNombre = validarNombre(nombre);

        if (errorNombre) {

            return res.status(400).json({ mensaje: errorNombre });

        }

        // =====================================
        // VALIDAR PRECIO
        // =====================================

        const errorPrecio = validarPrecio(precio);

        if (errorPrecio) {

            return res.status(400).json({ mensaje: errorPrecio });

        }

        // =====================================
        // VALIDAR STOCK
        // =====================================

        const errorStock = validarStock(stock);

        if (errorStock) {

            return res.status(400).json({ mensaje: errorStock });

        }

        // =====================================
        // VALIDAR CATEGORÍA
        // =====================================

        const errorCategoria = await validarCategoria(categoria_id);

        if (errorCategoria) {

            return res.status(400).json({ mensaje: errorCategoria });

        }

        // =====================================
        // INICIAR TRANSACCIÓN
        // =====================================

        await transaction.begin();

        // =====================================
        // VERIFICAR QUE EL PRODUCTO EXISTA
        // =====================================

        const productoActual = await transaction.request().query`

            SELECT imagen

            FROM Productos

            WHERE id = ${id}
              AND activo = 1
        `;

        if (productoActual.recordset.length === 0) {

            await transaction.rollback();

            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });

        }

        // =====================================
        // IMAGEN
        // =====================================

        let imagen = productoActual.recordset[0].imagen;

        if (req.file) {

            imagen = `/uploads/${req.file.filename}`;

        }

        // =====================================
        // ACTUALIZAR PRODUCTO
        // =====================================

        await transaction.request().query`

            UPDATE Productos

            SET

                nombre = ${nombre.trim()},
                descripcion = ${descripcion},
                precio = ${precio},
                categoria_id = ${categoria_id},
                imagen = ${imagen}

            WHERE id = ${id}
        `;

        // =====================================
        // ACTUALIZAR INVENTARIO
        // =====================================

        await transaction.request().query`

            UPDATE Inventario

            SET stock = ${stock}

            WHERE producto_id = ${id}
        `;

        // =====================================
        // CONFIRMAR TRANSACCIÓN
        // =====================================

        await transaction.commit();

        res.json({
            mensaje: 'Producto actualizado'
        });

    } catch (error) {

        try {
            await transaction.rollback();
        } catch (rollbackError) {
            // Ignorar si ya fue revertida
        }

        next(error);

    }

};


// =====================================
// ELIMINAR PRODUCTO (DESACTIVAR)
// =====================================

const eliminarProducto = async (req, res, next) => {

    try {

        const { id } = req.params;

        const resultado = await sql.query`

            UPDATE Productos

            SET activo = 0

            WHERE id = ${id}
              AND activo = 1
        `;

        if (resultado.rowsAffected[0] === 0) {

            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });

        }

        res.json({
            mensaje: 'Producto desactivado'
        });

    } catch (error) {

        next(error);

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