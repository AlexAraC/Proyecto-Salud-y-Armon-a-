-- Agregar mision y vision a informacionInstitucional
ALTER TABLE informacionInstitucional
ADD mision VARCHAR(1000);
GO

ALTER TABLE informacionInstitucional
ADD vision VARCHAR(1000);
GO

-- Migrar datos existentes de descripcion a mision (si aplica)
UPDATE informacionInstitucional
SET mision = descripcion
WHERE descripcion IS NOT NULL;
GO

-- Eliminar columna descripcion
ALTER TABLE informacionInstitucional
DROP COLUMN descripcion;
GO

-- Eliminar columnas mision/vision de informacionCeo (agregadas por error)
ALTER TABLE informacionCeo
DROP COLUMN mision;
GO

ALTER TABLE informacionCeo
DROP COLUMN vision;
GO
