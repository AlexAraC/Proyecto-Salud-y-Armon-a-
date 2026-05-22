CREATE TABLE Usuarios (

    id INT PRIMARY KEY IDENTITY(1,1),

    nombre VARCHAR(100),

    correo VARCHAR(150) UNIQUE,

    contraseña VARCHAR(255),

    rol VARCHAR(50),

    direccion VARCHAR(MAX)
);
CREATE TABLE Categorias (

    id INT PRIMARY KEY IDENTITY(1,1),

    nombre VARCHAR(100)
);
CREATE TABLE Productos (

    id INT PRIMARY KEY IDENTITY(1,1),

    nombre VARCHAR(100),

    descripcion VARCHAR(500),

    precio DECIMAL(10,2),

    categoria_id INT,

    FOREIGN KEY (categoria_id)
    REFERENCES Categorias(id)
);
CREATE TABLE Inventario (

    id INT PRIMARY KEY IDENTITY(1,1),

    producto_id INT UNIQUE,

    stock INT,

    FOREIGN KEY (producto_id)
    REFERENCES Productos(id)
);
CREATE TABLE Carrito (

    id INT PRIMARY KEY IDENTITY(1,1),

    usuario_id INT,

    estado VARCHAR(50),

    fecha DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (usuario_id)
    REFERENCES Usuarios(id)
);
CREATE TABLE CarritoDetalle (

    id INT PRIMARY KEY IDENTITY(1,1),

    carrito_id INT,

    producto_id INT,

    cantidad INT,

    FOREIGN KEY (carrito_id)
    REFERENCES Carrito(id),

    FOREIGN KEY (producto_id)
    REFERENCES Productos(id)
);
CREATE TABLE Pedidos (

    id INT PRIMARY KEY IDENTITY(1,1),

    usuario_id INT,

    fecha DATETIME DEFAULT GETDATE(),

    estado VARCHAR(50),

    total DECIMAL(10,2),

    metodo_pago VARCHAR(100),

    FOREIGN KEY (usuario_id)
    REFERENCES Usuarios(id)
);
CREATE TABLE DetallePedido (

    id INT PRIMARY KEY IDENTITY(1,1),

    pedido_id INT,

    producto_id INT,

    nombre_producto VARCHAR(100),

    cantidad INT,

    subtotal DECIMAL(10,2),

    FOREIGN KEY (pedido_id)
    REFERENCES Pedidos(id),

    FOREIGN KEY (producto_id)
    REFERENCES Productos(id)
);
CREATE TABLE informacionCeo (

    id INT PRIMARY KEY IDENTITY(1,1),

    nombre VARCHAR(100),

    correo VARCHAR(150) UNIQUE,

    telefono VARCHAR(20)
);
CREATE TABLE informacionInstitucional (
    id INT PRIMARY KEY IDENTITY(1,1),

    slogan VARCHAR(200),

    descripcion VARCHAR(1000),

    telefono VARCHAR(20),

    correo VARCHAR(150) UNIQUE

)

CREATE TABLE Comentario (

    id INT PRIMARY KEY IDENTITY(1,1),

    tipo VARCHAR(20) NOT NULL
    CHECK (tipo IN ('comentario', 'reporte')),

    contenido VARCHAR(MAX) NOT NULL,

    fecha DATETIME NOT NULL DEFAULT GETDATE()
);

ALTER TABLE Productos

ADD destacado BIT DEFAULT 0;

ALTER TABLE Usuarios

ADD codigo_recuperacion VARCHAR(10),
    expiracion_codigo DATETIME;


SELECT * FROM Productos
SELECT * FROM Inventario
