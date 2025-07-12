-- Script para agregar el campo TAR_Estado a la tabla Tareas
-- Ejecutar este script en la base de datos si el campo no existe

-- Verificar si el campo TAR_Estado existe
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Tareas' 
    AND COLUMN_NAME = 'TAR_Estado'
)
BEGIN
    -- Agregar el campo TAR_Estado
    ALTER TABLE Tareas 
    ADD TAR_Estado NVARCHAR(50) DEFAULT 'pendiente';
    
    PRINT 'Campo TAR_Estado agregado exitosamente';
    
    -- Actualizar tareas existentes con estado por defecto
    UPDATE Tareas 
    SET TAR_Estado = CASE 
        WHEN TAR_Completada = 1 THEN 'completada'
        ELSE 'pendiente'
    END
    WHERE TAR_Estado IS NULL;
    
    PRINT 'Tareas existentes actualizadas con estado por defecto';
END
ELSE
BEGIN
    PRINT 'El campo TAR_Estado ya existe en la tabla Tareas';
END

-- Verificar que el campo se agregó correctamente
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Tareas' 
AND COLUMN_NAME = 'TAR_Estado'; 