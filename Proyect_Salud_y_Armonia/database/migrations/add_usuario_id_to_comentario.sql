ALTER TABLE Comentario
ADD usuario_id INT NOT NULL
CONSTRAINT FK_Comentario_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(id);
