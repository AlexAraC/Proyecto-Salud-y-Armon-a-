const STORAGE_KEY = 'carrito_local';

export const obtenerCarritoLocal = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const guardarCarritoLocal = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const agregarAlCarritoLocal = (producto, cantidad = 1) => {
    const items = obtenerCarritoLocal();
    const existente = items.find((item) => item.producto_id === producto.id);

    if (existente) {
        existente.cantidad += cantidad;
    } else {
        items.push({
            detalle_id: Date.now(),
            producto_id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad,
            subtotal: producto.precio * cantidad
        });
    }

    guardarCarritoLocal(items);
    return items;
};

export const actualizarCantidadLocal = (producto_id, cantidad) => {
    const items = obtenerCarritoLocal();
    const item = items.find((i) => i.producto_id === producto_id);
    if (item) {
        item.cantidad = cantidad;
        item.subtotal = item.precio * cantidad;
    }
    guardarCarritoLocal(items);
    return items;
};

export const eliminarDelCarritoLocal = (producto_id) => {
    const items = obtenerCarritoLocal().filter(
        (i) => i.producto_id !== producto_id
    );
    guardarCarritoLocal(items);
    return items;
};

export const vaciarCarritoLocal = () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};

export const calcularTotalLocal = (items) => {
    return items.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
};
