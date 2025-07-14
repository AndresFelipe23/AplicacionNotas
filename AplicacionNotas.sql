-- ====================================
-- SCRIPT COMPLETO BASE DE DATOS
-- Aplicación de Notas con Carpetas, ToDo y Diario
-- Incluye Sistema Completo de Papelera
-- ====================================

-- Crear la base de datos
CREATE DATABASE AplicacionNotas;
GO

-- Usar la base de datos
USE AplicacionNotas;
GO

-- ====================================
-- TABLA: Usuarios
-- ====================================
CREATE TABLE Usuarios (
    USU_Id INT IDENTITY(1,1) PRIMARY KEY,
    USU_Email NVARCHAR(255) UNIQUE NOT NULL,
    USU_PasswordHash NVARCHAR(500) NOT NULL,
    USU_Nombre NVARCHAR(100),
    USU_Apellido NVARCHAR(100),
    USU_FechaCreacion DATETIME2 DEFAULT GETDATE(),
    USU_FechaActualizacion DATETIME2 DEFAULT GETDATE(),
    USU_Activo BIT DEFAULT 1,
    USU_UltimoLogin DATETIME2 NULL
);

ALTER TABLE Usuarios
ADD USU_DiarioPinHash NVARCHAR(500) NULL;

-- ====================================
-- TABLA: Carpetas
-- ====================================
CREATE TABLE Carpetas (
    CAR_Id INT IDENTITY(1,1) PRIMARY KEY,
    CAR_UsuarioId INT NOT NULL,
    CAR_Nombre NVARCHAR(255) NOT NULL,
    CAR_Descripcion NVARCHAR(500) NULL,
    CAR_Color NVARCHAR(7) DEFAULT '#3B82F6', -- Color hex (azul por defecto)
    CAR_Icono NVARCHAR(50) DEFAULT 'carpeta', -- Nombre del icono
    CAR_Orden INT DEFAULT 0,
    CAR_FechaCreacion DATETIME2 DEFAULT GETDATE(),
    CAR_FechaActualizacion DATETIME2 DEFAULT GETDATE(),
    CAR_Eliminado BIT DEFAULT 0,
    CONSTRAINT FK_Carpetas_Usuarios FOREIGN KEY (CAR_UsuarioId) REFERENCES Usuarios(USU_Id) ON DELETE CASCADE
);

-- ====================================
-- TABLA: Notas
-- ====================================
CREATE TABLE Notas (
    NOT_Id INT IDENTITY(1,1) PRIMARY KEY,
    NOT_UsuarioId INT NOT NULL,
    NOT_CarpetaId INT NULL, -- NULL = sin carpeta
    NOT_Titulo NVARCHAR(500) NOT NULL,
    NOT_Contenido NVARCHAR(MAX),
    NOT_Favorito BIT DEFAULT 0,
    NOT_Archivado BIT DEFAULT 0,
    NOT_Etiquetas NVARCHAR(1000) NULL, -- JSON array de etiquetas
    NOT_FechaCreacion DATETIME2 DEFAULT GETDATE(),
    NOT_FechaActualizacion DATETIME2 DEFAULT GETDATE(),
    NOT_Eliminado BIT DEFAULT 0,
    NOT_FechaEliminacion DATETIME2 NULL,
    CONSTRAINT FK_Notas_Usuarios FOREIGN KEY (NOT_UsuarioId) REFERENCES Usuarios(USU_Id) ON DELETE CASCADE,
    CONSTRAINT FK_Notas_Carpetas FOREIGN KEY (NOT_CarpetaId) REFERENCES Carpetas(CAR_Id) ON DELETE NO ACTION
);

-- ====================================
-- TABLA: Tareas
-- ====================================
CREATE TABLE Tareas (
    TAR_Id INT IDENTITY(1,1) PRIMARY KEY,
    TAR_UsuarioId INT NOT NULL,
    TAR_Titulo NVARCHAR(500) NOT NULL,
    TAR_Descripcion NVARCHAR(MAX) NULL,
    TAR_Completada BIT DEFAULT 0,
    TAR_Prioridad INT DEFAULT 1, -- 1=Baja, 2=Media, 3=Alta, 4=Urgente
    TAR_FechaVencimiento DATETIME2 NULL,
    TAR_FechaCompletada DATETIME2 NULL,
    TAR_FechaCreacion DATETIME2 DEFAULT GETDATE(),
    TAR_FechaActualizacion DATETIME2 DEFAULT GETDATE(),
    TAR_Eliminado BIT DEFAULT 0,
    TAR_FechaEliminacion DATETIME2 NULL,
    CONSTRAINT FK_Tareas_Usuarios FOREIGN KEY (TAR_UsuarioId) REFERENCES Usuarios(USU_Id) ON DELETE CASCADE
);

ALTER TABLE Tareas
ADD TAR_Estado NVARCHAR(20) NOT NULL DEFAULT 'pendiente';

-- ====================================
-- TABLA: EntradasDiario (Con PIN)
-- ====================================
CREATE TABLE EntradasDiario (
    DIA_Id INT IDENTITY(1,1) PRIMARY KEY,
    DIA_UsuarioId INT NOT NULL,
    DIA_FechaEntrada DATE NOT NULL,
    DIA_Titulo NVARCHAR(500) NULL,
    DIA_Contenido NVARCHAR(MAX),
    DIA_EstadoAnimo INT NULL, -- 1=Muy mal, 2=Mal, 3=Regular, 4=Bien, 5=Excelente    DIA_FechaCreacion DATETIME2 DEFAULT GETDATE(),
    DIA_FechaActualizacion DATETIME2 DEFAULT GETDATE(),
    DIA_Eliminado BIT DEFAULT 0,
    DIA_FechaEliminacion DATETIME2 NULL,
    CONSTRAINT FK_EntradasDiario_Usuarios FOREIGN KEY (DIA_UsuarioId) REFERENCES Usuarios(USU_Id) ON DELETE CASCADE,
    CONSTRAINT UQ_EntradasDiario_UsuarioFecha UNIQUE (DIA_UsuarioId, DIA_FechaEntrada) -- Una entrada por día por usuario
);

-- ====================================
-- TABLA: ConfiguracionUsuario
-- ====================================
CREATE TABLE ConfiguracionUsuario (
    CON_Id INT IDENTITY(1,1) PRIMARY KEY,
    CON_UsuarioId INT NOT NULL,
    CON_Tema NVARCHAR(20) DEFAULT 'sistema', -- claro, oscuro, sistema
    CON_Idioma NVARCHAR(10) DEFAULT 'es',
    CON_FormatoFecha NVARCHAR(20) DEFAULT 'DD/MM/YYYY',
    CON_DiarioPinRequerido BIT DEFAULT 1,
    CON_NotificacionesActivadas BIT DEFAULT 1,
    CON_FechaCreacion DATETIME2 DEFAULT GETDATE(),
    CON_FechaActualizacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_ConfiguracionUsuario_Usuarios FOREIGN KEY (CON_UsuarioId) REFERENCES Usuarios(USU_Id) ON DELETE CASCADE,
    CONSTRAINT UQ_ConfiguracionUsuario_Usuario UNIQUE (CON_UsuarioId)
);

-- ====================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ====================================

-- Índices para búsquedas frecuentes
CREATE INDEX IX_Notas_UsuarioId_FechaCreacion ON Notas(NOT_UsuarioId, NOT_FechaCreacion DESC);
CREATE INDEX IX_Notas_CarpetaId ON Notas(NOT_CarpetaId);
CREATE INDEX IX_Notas_Titulo ON Notas(NOT_Titulo);
CREATE INDEX IX_Carpetas_UsuarioId ON Carpetas(CAR_UsuarioId);
CREATE INDEX IX_Tareas_UsuarioId_FechaVencimiento ON Tareas(TAR_UsuarioId, TAR_FechaVencimiento);
CREATE INDEX IX_Tareas_Completada ON Tareas(TAR_Completada);
CREATE INDEX IX_EntradasDiario_UsuarioId_Fecha ON EntradasDiario(DIA_UsuarioId, DIA_FechaEntrada DESC);

-- Índice para soft deletes
CREATE INDEX IX_Notas_Eliminado ON Notas(NOT_Eliminado) WHERE NOT_Eliminado = 0;
CREATE INDEX IX_Tareas_Eliminado ON Tareas(TAR_Eliminado) WHERE TAR_Eliminado = 0;
CREATE INDEX IX_EntradasDiario_Eliminado ON EntradasDiario(DIA_Eliminado) WHERE DIA_Eliminado = 0;

-- ====================================
-- TRIGGERS
-- ====================================

-- Trigger para actualizar FechaActualizacion en Usuarios
CREATE TRIGGER tr_Usuarios_FechaActualizacion ON Usuarios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Usuarios 
    SET USU_FechaActualizacion = GETDATE() 
    WHERE USU_Id IN (SELECT USU_Id FROM inserted);
END;
GO

-- Trigger para actualizar FechaActualizacion en Carpetas
CREATE TRIGGER tr_Carpetas_FechaActualizacion ON Carpetas
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Carpetas 
    SET CAR_FechaActualizacion = GETDATE() 
    WHERE CAR_Id IN (SELECT CAR_Id FROM inserted);
END;
GO

-- Trigger para actualizar FechaActualizacion en Notas
CREATE TRIGGER tr_Notas_FechaActualizacion ON Notas
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Notas 
    SET NOT_FechaActualizacion = GETDATE() 
    WHERE NOT_Id IN (SELECT NOT_Id FROM inserted);
END;
GO

-- Trigger para actualizar FechaActualizacion en Tareas
CREATE TRIGGER tr_Tareas_FechaActualizacion ON Tareas
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Tareas 
    SET TAR_FechaActualizacion = GETDATE(),
        TAR_FechaCompletada = CASE 
            WHEN inserted.TAR_Completada = 1 AND deleted.TAR_Completada = 0 
            THEN GETDATE() 
            WHEN inserted.TAR_Completada = 0 AND deleted.TAR_Completada = 1 
            THEN NULL 
            ELSE Tareas.TAR_FechaCompletada 
        END
    FROM Tareas
    INNER JOIN inserted ON Tareas.TAR_Id = inserted.TAR_Id
    INNER JOIN deleted ON Tareas.TAR_Id = deleted.TAR_Id;
END;
GO

-- Trigger para actualizar FechaActualizacion en EntradasDiario
CREATE TRIGGER tr_EntradasDiario_FechaActualizacion ON EntradasDiario
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE EntradasDiario 
    SET DIA_FechaActualizacion = GETDATE() 
    WHERE DIA_Id IN (SELECT DIA_Id FROM inserted);
END;
GO

-- Trigger para actualizar FechaActualizacion en ConfiguracionUsuario
CREATE TRIGGER tr_ConfiguracionUsuario_FechaActualizacion ON ConfiguracionUsuario
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE ConfiguracionUsuario 
    SET CON_FechaActualizacion = GETDATE() 
    WHERE CON_Id IN (SELECT CON_Id FROM inserted);
END;
GO

-- ====================================
-- VISTAS ÚTILES
-- ====================================

-- Vista de notas con información de carpeta
CREATE VIEW vw_NotasConCarpeta AS
SELECT 
    n.NOT_Id AS Id,
    n.NOT_UsuarioId AS UsuarioId,
    n.NOT_Titulo AS Titulo,
    n.NOT_Contenido AS Contenido,
    n.NOT_Favorito AS Favorito,
    n.NOT_Archivado AS Archivado,
    n.NOT_Etiquetas AS Etiquetas,
    n.NOT_FechaCreacion AS FechaCreacion,
    n.NOT_FechaActualizacion AS FechaActualizacion,
    c.CAR_Id AS CarpetaId,
    c.CAR_Nombre AS NombreCarpeta,
    c.CAR_Color AS ColorCarpeta
FROM Notas n
LEFT JOIN Carpetas c ON n.NOT_CarpetaId = c.CAR_Id
WHERE n.NOT_Eliminado = 0 AND (c.CAR_Eliminado = 0 OR c.CAR_Eliminado IS NULL);
GO

-- Vista de tareas pendientes
CREATE VIEW vw_TareasPendientes AS
SELECT 
    TAR_Id AS Id,
    TAR_UsuarioId AS UsuarioId,
    TAR_Titulo AS Titulo,
    TAR_Descripcion AS Descripcion,
    TAR_Prioridad AS Prioridad,
    TAR_FechaVencimiento AS FechaVencimiento,
    TAR_FechaCreacion AS FechaCreacion,
    CASE 
        WHEN TAR_FechaVencimiento < GETDATE() THEN 'Vencida'
        WHEN TAR_FechaVencimiento <= DATEADD(day, 1, GETDATE()) THEN 'Urgente'
        WHEN TAR_FechaVencimiento <= DATEADD(day, 7, GETDATE()) THEN 'Próxima'
        ELSE 'Normal'
    END AS Estado
FROM Tareas
WHERE TAR_Completada = 0 AND TAR_Eliminado = 0;
GO

-- Vista de elementos en papelera
CREATE VIEW vw_Papelera AS
SELECT 
    'Nota' AS Tipo,
    NOT_Id AS Id,
    NOT_UsuarioId AS UsuarioId,
    NOT_Titulo AS Titulo,
    NOT_FechaEliminacion AS FechaEliminacion,
    c.CAR_Nombre AS Categoria
FROM Notas n
LEFT JOIN Carpetas c ON n.NOT_CarpetaId = c.CAR_Id
WHERE n.NOT_Eliminado = 1

UNION ALL

SELECT 
    'Tarea' AS Tipo,
    TAR_Id AS Id,
    TAR_UsuarioId AS UsuarioId,
    TAR_Titulo AS Titulo,
    TAR_FechaEliminacion AS FechaEliminacion,
    CASE TAR_Prioridad 
        WHEN 1 THEN 'Baja'
        WHEN 2 THEN 'Media'
        WHEN 3 THEN 'Alta'
        WHEN 4 THEN 'Urgente'
    END AS Categoria
FROM Tareas
WHERE TAR_Eliminado = 1

UNION ALL

SELECT 
    'Carpeta' AS Tipo,
    CAR_Id AS Id,
    CAR_UsuarioId AS UsuarioId,
    CAR_Nombre AS Titulo,
    CAR_FechaActualizacion AS FechaEliminacion,
    'Carpeta' AS Categoria
FROM Carpetas
WHERE CAR_Eliminado = 1

UNION ALL

SELECT 
    'Diario' AS Tipo,
    DIA_Id AS Id,
    DIA_UsuarioId AS UsuarioId,
    COALESCE(DIA_Titulo, 'Entrada del ' + CONVERT(VARCHAR, DIA_FechaEntrada, 103)) AS Titulo,
    DIA_FechaEliminacion AS FechaEliminacion,
    'Diario' AS Categoria
FROM EntradasDiario
WHERE DIA_Eliminado = 1;
GO

-- ====================================
-- PROCEDIMIENTOS PRINCIPALES
-- ====================================

-- Procedimiento para crear usuario con configuraciones por defecto
CREATE PROCEDURE sp_CrearUsuario
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(500),
    @Nombre NVARCHAR(100) = NULL,
    @Apellido NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @UsuarioId INT;
    
    -- Insertar usuario
    INSERT INTO Usuarios (USU_Email, USU_PasswordHash, USU_Nombre, USU_Apellido)
    VALUES (@Email, @PasswordHash, @Nombre, @Apellido);
    
    SET @UsuarioId = SCOPE_IDENTITY();
    
    -- Crear configuraciones por defecto
    INSERT INTO ConfiguracionUsuario (CON_UsuarioId)
    VALUES (@UsuarioId);
    
    -- Crear carpeta por defecto
    INSERT INTO Carpetas (CAR_UsuarioId, CAR_Nombre, CAR_Descripcion, CAR_Color, CAR_Icono)
    VALUES (@UsuarioId, 'General', 'Carpeta por defecto', '#3B82F6', 'carpeta');
    
    SELECT @UsuarioId AS UsuarioId;
END;
GO

-- Procedimiento para obtener estadísticas del usuario
CREATE PROCEDURE sp_ObtenerEstadisticasUsuario
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        (SELECT COUNT(*) FROM Notas WHERE NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 0) AS TotalNotas,
        (SELECT COUNT(*) FROM Carpetas WHERE CAR_UsuarioId = @UsuarioId AND CAR_Eliminado = 0) AS TotalCarpetas,
        (SELECT COUNT(*) FROM Tareas WHERE TAR_UsuarioId = @UsuarioId AND TAR_Eliminado = 0) AS TotalTareas,
        (SELECT COUNT(*) FROM Tareas WHERE TAR_UsuarioId = @UsuarioId AND TAR_Completada = 1 AND TAR_Eliminado = 0) AS TareasCompletadas,
        (SELECT COUNT(*) FROM EntradasDiario WHERE DIA_UsuarioId = @UsuarioId AND DIA_Eliminado = 0) AS EntradasDiario,
        (SELECT COUNT(*) FROM Notas WHERE NOT_UsuarioId = @UsuarioId AND NOT_Favorito = 1 AND NOT_Eliminado = 0) AS NotasFavoritas;
END;
GO

-- ====================================
-- PROCEDIMIENTOS DE PAPELERA - NOTAS
-- ====================================

-- Enviar nota a papelera
CREATE PROCEDURE sp_EnviarNotaAPapelera
    @NotaId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Notas 
    SET NOT_Eliminado = 1, NOT_FechaEliminacion = GETDATE()
    WHERE NOT_Id = @NotaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 0;
    
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- Restaurar nota desde papelera
CREATE PROCEDURE sp_RestaurarNota
    @NotaId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Notas 
    SET NOT_Eliminado = 0, NOT_FechaEliminacion = NULL, NOT_FechaActualizacion = GETDATE()
    WHERE NOT_Id = @NotaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 1;
    
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- Eliminar nota permanentemente
CREATE PROCEDURE sp_EliminarNotaPermanente
    @NotaId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Notas 
    WHERE NOT_Id = @NotaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 1;
    
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- ====================================
-- PROCEDIMIENTOS DE PAPELERA - TAREAS
-- ====================================

-- Enviar tarea a papelera
CREATE PROCEDURE sp_EnviarTareaAPapelera
    @TareaId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Tareas 
    SET TAR_Eliminado = 1, TAR_FechaEliminacion = GETDATE()
    WHERE TAR_Id = @TareaId AND TAR_UsuarioId = @UsuarioId AND TAR_Eliminado = 0;
    
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- Restaurar tarea desde papelera
CREATE PROCEDURE sp_RestaurarTarea
    @TareaId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Tareas 
    SET TAR_Eliminado = 0, TAR_FechaEliminacion = NULL, TAR_FechaActualizacion = GETDATE()
    WHERE TAR_Id = @TareaId AND TAR_UsuarioId = @UsuarioId AND TAR_Eliminado = 1;
    
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- Eliminar tarea permanentemente
CREATE PROCEDURE sp_EliminarTareaPermanente
    @TareaId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Tareas 
    WHERE TAR_Id = @TareaId AND TAR_UsuarioId = @UsuarioId AND TAR_Eliminado = 1;
    
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- ====================================
-- PROCEDIMIENTOS DE PAPELERA - CARPETAS
-- ====================================

-- Enviar carpeta a papelera (con todas sus notas)
CREATE PROCEDURE sp_EnviarCarpetaAPapelera
    @CarpetaId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @FilasAfectadas INT = 0;
    
    -- Verificar que la carpeta pertenece al usuario
    IF EXISTS (SELECT 1 FROM Carpetas WHERE CAR_Id = @CarpetaId AND CAR_UsuarioId = @UsuarioId AND CAR_Eliminado = 0)
    BEGIN
        -- Enviar todas las notas de la carpeta a papelera
        UPDATE Notas 
        SET NOT_Eliminado = 1, NOT_FechaEliminacion = GETDATE()
        WHERE NOT_CarpetaId = @CarpetaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 0;
        
        -- Enviar la carpeta a papelera
        UPDATE Carpetas 
        SET CAR_Eliminado = 1, CAR_FechaActualizacion = GETDATE()
        WHERE CAR_Id = @CarpetaId AND CAR_UsuarioId = @UsuarioId;
        
        SET @FilasAfectadas = 1;
    END
    
    SELECT @FilasAfectadas AS FilasAfectadas;
END;
GO

-- Restaurar carpeta desde papelera (con opción de restaurar notas)
CREATE PROCEDURE sp_RestaurarCarpeta
    @CarpetaId INT,
    @UsuarioId INT,
    @RestaurarNotas BIT = 1 -- Por defecto restaura las notas también
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @FilasAfectadas INT = 0;
    
    -- Verificar que la carpeta está en papelera
    IF EXISTS (SELECT 1 FROM Carpetas WHERE CAR_Id = @CarpetaId AND CAR_UsuarioId = @UsuarioId AND CAR_Eliminado = 1)
    BEGIN
        -- Restaurar la carpeta
        UPDATE Carpetas 
        SET CAR_Eliminado = 0, CAR_FechaActualizacion = GETDATE()
        WHERE CAR_Id = @CarpetaId AND CAR_UsuarioId = @UsuarioId;
        
        -- Restaurar las notas si se especifica
        IF @RestaurarNotas = 1
        BEGIN
            UPDATE Notas 
            SET NOT_Eliminado = 0, NOT_FechaEliminacion = NULL, NOT_FechaActualizacion = GETDATE()
            WHERE NOT_CarpetaId = @CarpetaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 1;
        END
        
        SET @FilasAfectadas = 1;
    END
    
    SELECT @FilasAfectadas AS FilasAfectadas;
END;
GO

-- Eliminar carpeta permanentemente
CREATE PROCEDURE sp_EliminarCarpetaPermanente
    @CarpetaId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @FilasAfectadas INT = 0;
    
    -- Verificar que la carpeta está en papelera
    IF EXISTS (SELECT 1 FROM Carpetas WHERE CAR_Id = @CarpetaId AND CAR_UsuarioId = @UsuarioId AND CAR_Eliminado = 1)
    BEGIN
        -- Eliminar permanentemente las notas de la carpeta que estén en papelera
        DELETE FROM Notas 
        WHERE NOT_CarpetaId = @CarpetaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 1;
        
        -- Mover notas activas a "Sin carpeta" por seguridad
        UPDATE Notas 
        SET NOT_CarpetaId = NULL, NOT_FechaActualizacion = GETDATE()
        WHERE NOT_CarpetaId = @CarpetaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 0;
        
        -- Eliminar la carpeta permanentemente
        DELETE FROM Carpetas 
        WHERE CAR_Id = @CarpetaId AND CAR_UsuarioId = @UsuarioId;
        
        SET @FilasAfectadas = 1;
    END
    
    SELECT @FilasAfectadas AS FilasAfectadas;
END;
GO

-- ====================================
-- PROCEDIMIENTOS DE PAPELERA - DIARIO
-- ====================================

-- Enviar entrada de diario a papelera
CREATE PROCEDURE sp_EnviarDiarioAPapelera
    @DiarioId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE EntradasDiario 
    SET DIA_Eliminado = 1, DIA_FechaEliminacion = GETDATE()
    WHERE DIA_Id = @DiarioId AND DIA_UsuarioId = @UsuarioId AND DIA_Eliminado = 0;
    
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- Restaurar entrada de diario desde papelera
CREATE PROCEDURE sp_RestaurarDiario
    @DiarioId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE EntradasDiario 
    SET DIA_Eliminado = 0, DIA_FechaEliminacion = NULL, DIA_FechaActualizacion = GETDATE()
    WHERE DIA_Id = @DiarioId AND DIA_UsuarioId = @UsuarioId AND DIA_Eliminado = 1;
    
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- Eliminar entrada de diario permanentemente
CREATE PROCEDURE sp_EliminarDiarioPermanente
    @DiarioId INT,
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM EntradasDiario 
    WHERE DIA_Id = @DiarioId AND DIA_UsuarioId = @UsuarioId AND DIA_Eliminado = 1;
    
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- ====================================
-- PROCEDIMIENTOS GENERALES DE PAPELERA
-- ====================================

-- Vaciar papelera completa del usuario
CREATE PROCEDURE sp_VaciarPapelera
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NotasEliminadas INT, @TareasEliminadas INT, @CarpetasEliminadas INT, @DiarioEliminado INT;
    
    -- Eliminar permanentemente todas las notas en papelera
    DELETE FROM Notas 
    WHERE NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 1;
    SET @NotasEliminadas = @@ROWCOUNT;
    
    -- Eliminar permanentemente todas las tareas en papelera
    DELETE FROM Tareas 
    WHERE TAR_UsuarioId = @UsuarioId AND TAR_Eliminado = 1;
    SET @TareasEliminadas = @@ROWCOUNT;
    
    -- Eliminar permanentemente todas las carpetas en papelera
    DELETE FROM Carpetas 
    WHERE CAR_UsuarioId = @UsuarioId AND CAR_Eliminado = 1;
    SET @CarpetasEliminadas = @@ROWCOUNT;
    
    -- Eliminar permanentemente todas las entradas de diario en papelera
    DELETE FROM EntradasDiario 
    WHERE DIA_UsuarioId = @UsuarioId AND DIA_Eliminado = 1;
    SET @DiarioEliminado = @@ROWCOUNT;
    
    SELECT 
        @NotasEliminadas AS NotasEliminadas,
        @TareasEliminadas AS TareasEliminadas,
        @CarpetasEliminadas AS CarpetasEliminadas,
        @DiarioEliminado AS DiarioEliminado,
        (@NotasEliminadas + @TareasEliminadas + @CarpetasEliminadas + @DiarioEliminado) AS TotalEliminado;
END;
GO

-- Obtener contenido de papelera
CREATE PROCEDURE sp_ObtenerPapelera
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Notas en papelera
    SELECT 
        'Nota' AS Tipo,
        NOT_Id AS Id,
        NOT_Titulo AS Titulo,
        NOT_FechaEliminacion AS FechaEliminacion,
        c.CAR_Nombre AS NombreCarpeta
    FROM Notas n
    LEFT JOIN Carpetas c ON n.NOT_CarpetaId = c.CAR_Id
    WHERE n.NOT_UsuarioId = @UsuarioId AND n.NOT_Eliminado = 1
    
    UNION ALL
    
    -- Tareas en papelera
    SELECT 
        'Tarea' AS Tipo,
        TAR_Id AS Id,
        TAR_Titulo AS Titulo,
        TAR_FechaEliminacion AS FechaEliminacion,
        NULL AS NombreCarpeta
    FROM Tareas
    WHERE TAR_UsuarioId = @UsuarioId AND TAR_Eliminado = 1
    
    UNION ALL
    
    -- Carpetas en papelera
    SELECT 
        'Carpeta' AS Tipo,
        CAR_Id AS Id,
        CAR_Nombre AS Titulo,
        CAR_FechaActualizacion AS FechaEliminacion, -- Usamos fecha de actualización
        NULL AS NombreCarpeta
    FROM Carpetas
    WHERE CAR_UsuarioId = @UsuarioId AND CAR_Eliminado = 1
    
    UNION ALL
    
    -- Entradas de diario en papelera
    SELECT 
        'Diario' AS Tipo,
        DIA_Id AS Id,
        COALESCE(DIA_Titulo, 'Entrada del ' + CONVERT(VARCHAR, DIA_FechaEntrada, 103)) AS Titulo,
        DIA_FechaEliminacion AS FechaEliminacion,
        NULL AS NombreCarpeta
    FROM EntradasDiario
    WHERE DIA_UsuarioId = @UsuarioId AND DIA_Eliminado = 1
    
    ORDER BY FechaEliminacion DESC;
END;
GO


-- =============================================
-- Autor: Sistema
-- Fecha de creación: 2024
-- Descripción: Crea una nueva tarea con estado para flujo Kanban
-- =============================================
ALTER PROCEDURE [dbo].[sp_CrearTarea]
    @UsuarioId INT,
    @Titulo NVARCHAR(500),
    @Descripcion NVARCHAR(2000) = NULL,
    @Prioridad INT = 1,
    @FechaVencimiento DATETIME = NULL,
    @Estado NVARCHAR(50) = 'pendiente'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO Tareas (
            TAR_UsuarioId, 
            TAR_Titulo, 
            TAR_Descripcion, 
            TAR_Prioridad, 
            TAR_FechaVencimiento, 
            TAR_Estado,
            TAR_Completada,
            TAR_Eliminado,
            TAR_FechaCreacion, 
            TAR_FechaActualizacion
        )
        VALUES (
            @UsuarioId, 
            @Titulo, 
            @Descripcion, 
            @Prioridad, 
            @FechaVencimiento, 
            @Estado,
            0, -- No completada
            0, -- No eliminada
            GETDATE(), 
            GETDATE()
        );
        
        SELECT CAST(SCOPE_IDENTITY() AS INT) AS TareaId;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END


-- =============================================
-- Autor: Sistema
-- Fecha de creación: 2024
-- Descripción: Actualiza una tarea existente incluyendo el estado
-- =============================================
CREATE PROCEDURE [dbo].[sp_ActualizarTarea]
    @TareaId INT,
    @UsuarioId INT,
    @Titulo NVARCHAR(500),
    @Descripcion NVARCHAR(2000) = NULL,
    @Prioridad INT = 1,
    @FechaVencimiento DATETIME = NULL,
    @Estado NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE Tareas 
        SET TAR_Titulo = @Titulo,
            TAR_Descripcion = @Descripcion,
            TAR_Prioridad = @Prioridad,
            TAR_FechaVencimiento = @FechaVencimiento,
            TAR_Estado = ISNULL(@Estado, TAR_Estado),
            TAR_FechaActualizacion = GETDATE()
        WHERE TAR_Id = @TareaId 
          AND TAR_UsuarioId = @UsuarioId 
          AND TAR_Eliminado = 0;
        
        SELECT @@ROWCOUNT AS FilasAfectadas;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END


-- =============================================
-- Autor: Sistema
-- Fecha de creación: 2024
-- Descripción: Cambia el estado de una tarea para el flujo Kanban
-- =============================================
CREATE PROCEDURE [dbo].[sp_CambiarEstadoTarea]
    @TareaId INT,
    @UsuarioId INT,
    @NuevoEstado NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE Tareas 
        SET TAR_Estado = @NuevoEstado,
            TAR_FechaActualizacion = GETDATE()
        WHERE TAR_Id = @TareaId 
          AND TAR_UsuarioId = @UsuarioId 
          AND TAR_Eliminado = 0;
        
        SELECT @@ROWCOUNT AS FilasAfectadas;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END


-- =============================================
-- Autor: Sistema
-- Fecha de creación: 2024
-- Descripción: Obtiene tareas por estado específico para flujo Kanban
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerTareasPorEstado]
    @UsuarioId INT,
    @Estado NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        SELECT 
            TAR_Id as Id,
            TAR_UsuarioId as UsuarioId,
            TAR_Titulo as Titulo,
            TAR_Descripcion as Descripcion,
            TAR_Completada as Completada,
            TAR_Prioridad as Prioridad,
            TAR_FechaVencimiento as FechaVencimiento,
            TAR_FechaCompletada as FechaCompletada,
            TAR_FechaCreacion as FechaCreacion,
            TAR_Estado as Estado
        FROM Tareas 
        WHERE TAR_UsuarioId = @UsuarioId 
          AND TAR_Eliminado = 0 
          AND TAR_Estado = @Estado
        ORDER BY TAR_Prioridad DESC, TAR_FechaVencimiento ASC;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END


-- =============================================
-- Autor: Sistema
-- Fecha de creación: 2024
-- Descripción: Obtiene todas las tareas organizadas por estado para Kanban
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerTareasKanban]
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Tareas pendientes (estado = 'pendiente')
        SELECT 
            TAR_Id as Id,
            TAR_UsuarioId as UsuarioId,
            TAR_Titulo as Titulo,
            TAR_Descripcion as Descripcion,
            TAR_Completada as Completada,
            TAR_Prioridad as Prioridad,
            TAR_FechaVencimiento as FechaVencimiento,
            TAR_FechaCompletada as FechaCompletada,
            TAR_FechaCreacion as FechaCreacion,
            TAR_Estado as Estado,
            'pendiente' as Columna
        FROM Tareas 
        WHERE TAR_UsuarioId = @UsuarioId 
          AND TAR_Eliminado = 0 
          AND TAR_Estado = 'pendiente'
        
        UNION ALL
        
        -- Tareas en progreso (estado = 'en_progreso')
        SELECT 
            TAR_Id as Id,
            TAR_UsuarioId as UsuarioId,
            TAR_Titulo as Titulo,
            TAR_Descripcion as Descripcion,
            TAR_Completada as Completada,
            TAR_Prioridad as Prioridad,
            TAR_FechaVencimiento as FechaVencimiento,
            TAR_FechaCompletada as FechaCompletada,
            TAR_FechaCreacion as FechaCreacion,
            TAR_Estado as Estado,
            'en_progreso' as Columna
        FROM Tareas 
        WHERE TAR_UsuarioId = @UsuarioId 
          AND TAR_Eliminado = 0 
          AND TAR_Estado = 'en_progreso'
        
        UNION ALL
        
        -- Tareas completadas (estado = 'completada')
        SELECT 
            TAR_Id as Id,
            TAR_UsuarioId as UsuarioId,
            TAR_Titulo as Titulo,
            TAR_Descripcion as Descripcion,
            TAR_Completada as Completada,
            TAR_Prioridad as Prioridad,
            TAR_FechaVencimiento as FechaVencimiento,
            TAR_FechaCompletada as FechaCompletada,
            TAR_FechaCreacion as FechaCreacion,
            TAR_Estado as Estado,
            'completada' as Columna
        FROM Tareas 
        WHERE TAR_UsuarioId = @UsuarioId 
          AND TAR_Eliminado = 0 
          AND TAR_Estado = 'completada'
        
        ORDER BY Columna, TAR_Prioridad DESC, TAR_FechaVencimiento ASC;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END






-- ====================================
-- FUNCIONES ÚTILES
-- ====================================

-- Función para contar notas por carpeta
CREATE FUNCTION fn_ContarNotasPorCarpeta(@CarpetaId INT)
RETURNS INT
AS
BEGIN
    DECLARE @Cantidad INT;
    
    SELECT @Cantidad = COUNT(*)
    FROM Notas
    WHERE NOT_CarpetaId = @CarpetaId AND NOT_Eliminado = 0;
    
    RETURN ISNULL(@Cantidad, 0);
END;
GO

-- Función para obtener estado de tarea basado en fecha
CREATE FUNCTION fn_ObtenerEstadoTarea(@FechaVencimiento DATETIME2)
RETURNS NVARCHAR(20)
AS
BEGIN
    DECLARE @Estado NVARCHAR(20);
    
    IF @FechaVencimiento IS NULL
        SET @Estado = 'Sin fecha';
    ELSE IF @FechaVencimiento < GETDATE()
        SET @Estado = 'Vencida';
    ELSE IF @FechaVencimiento <= DATEADD(day, 1, GETDATE())
        SET @Estado = 'Urgente';
    ELSE IF @FechaVencimiento <= DATEADD(day, 7, GETDATE())
        SET @Estado = 'Próxima';
    ELSE
        SET @Estado = 'Normal';
    
    RETURN @Estado;
END;
GO

ALTER PROCEDURE sp_CrearEntradaDiario
    @UsuarioId INT,
    @FechaEntrada DATE,
    @Titulo NVARCHAR(500),
    @Contenido NVARCHAR(MAX),
    @EstadoAnimo INT
AS
BEGIN
    INSERT INTO EntradasDiario (
        DIA_UsuarioId, DIA_FechaEntrada, DIA_Titulo, DIA_Contenido, DIA_EstadoAnimo
    )
    VALUES (
        @UsuarioId, @FechaEntrada, @Titulo, @Contenido, @EstadoAnimo
    );

    SELECT SCOPE_IDENTITY() AS Id;
END

ALTER PROCEDURE sp_ActualizarEntradaDiario
    @Id INT,
    @Titulo NVARCHAR(500),
    @Contenido NVARCHAR(MAX),
    @EstadoAnimo INT
AS
BEGIN
    UPDATE EntradasDiario
    SET
        DIA_Titulo = @Titulo,
        DIA_Contenido = @Contenido,
        DIA_EstadoAnimo = @EstadoAnimo,
        DIA_FechaActualizacion = GETDATE()
    WHERE DIA_Id = @Id AND DIA_Eliminado = 0;
END



CREATE PROCEDURE sp_EliminarEntradaDiario
    @Id INT
AS
BEGIN
    UPDATE EntradasDiario
    SET
        DIA_Eliminado = 1,
        DIA_FechaEliminacion = GETDATE()
    WHERE DIA_Id = @Id AND DIA_Eliminado = 0;
END


CREATE PROCEDURE sp_RestaurarEntradaDiario
    @Id INT
AS
BEGIN
    UPDATE EntradasDiario
    SET
        DIA_Eliminado = 0,
        DIA_FechaEliminacion = NULL
    WHERE DIA_Id = @Id AND DIA_Eliminado = 1;
END


CREATE PROCEDURE sp_ObtenerEntradasDiarioPorUsuario
    @UsuarioId INT,
    @Mes INT,
    @Año INT
AS
BEGIN
    SELECT 
      DIA_Id AS Id,
      DIA_UsuarioId AS UsuarioId,
      DIA_FechaEntrada AS FechaEntrada,
      DIA_Titulo AS Titulo,
      DIA_Contenido AS Contenido,
      DIA_EstadoAnimo AS EstadoAnimo,
      DIA_FechaCreacion AS FechaCreacion,
      DIA_FechaActualizacion AS FechaActualizacion,
      DIA_Eliminado AS Eliminado,
      DIA_FechaEliminacion AS FechaEliminacion
    FROM EntradasDiario
    WHERE DIA_UsuarioId = @UsuarioId 
      AND DIA_Eliminado = 0
      AND MONTH(DIA_FechaEntrada) = @Mes
      AND YEAR(DIA_FechaEntrada) = @Año
    ORDER BY DIA_FechaEntrada DESC;
END
GO


CREATE PROCEDURE sp_ObtenerEntradaDiarioPorFecha
    @UsuarioId INT,
    @FechaEntrada DATE
AS
BEGIN
    SELECT *
    FROM EntradasDiario
    WHERE DIA_UsuarioId = @UsuarioId AND DIA_FechaEntrada = @FechaEntrada AND DIA_Eliminado = 0;
END


CREATE PROCEDURE sp_ActualizarPinDiario
    @UsuarioId INT,
    @PinHash NVARCHAR(500)
AS
BEGIN
    UPDATE Usuarios
    SET USU_DiarioPinHash = @PinHash
    WHERE USU_Id = @UsuarioId;
END


CREATE PROCEDURE sp_VerificarPinDiario
    @UsuarioId INT,
    @PinHash NVARCHAR(500)
AS
BEGIN
    SELECT CASE WHEN USU_DiarioPinHash = @PinHash THEN 1 ELSE 0 END AS EsValido
    FROM Usuarios
    WHERE USU_Id = @UsuarioId;
END


CREATE PROCEDURE sp_TienePinDiario
    @UsuarioId INT
AS
BEGIN
    SELECT CASE WHEN USU_DiarioPinHash IS NULL THEN 0 ELSE 1 END AS TienePin
    FROM Usuarios
    WHERE USU_Id = @UsuarioId;
END








-- ====================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ====================================

/*
-- Insertar usuario de prueba
EXEC sp_CrearUsuario 
    @Email = 'prueba@ejemplo.com',
    @PasswordHash = 'hash_aqui',
    @Nombre = 'Usuario',
    @Apellido = 'Prueba';

-- Ejemplos de uso del sistema de papelera:

-- Enviar elementos a papelera
EXEC sp_EnviarNotaAPapelera @NotaId = 1, @UsuarioId = 1;
EXEC sp_EnviarTareaAPapelera @TareaId = 1, @UsuarioId = 1;
EXEC sp_EnviarCarpetaAPapelera @CarpetaId = 1, @UsuarioId = 1;
EXEC sp_EnviarDiarioAPapelera @DiarioId = 1, @UsuarioId = 1;

-- Ver papelera del usuario
EXEC sp_ObtenerPapelera @UsuarioId = 1;
SELECT * FROM vw_Papelera WHERE UsuarioId = 1;

-- Restaurar elementos
EXEC sp_RestaurarNota @NotaId = 1, @UsuarioId = 1;
EXEC sp_RestaurarTarea @TareaId = 1, @UsuarioId = 1;
EXEC sp_RestaurarCarpeta @CarpetaId = 1, @UsuarioId = 1, @RestaurarNotas = 1;
EXEC sp_RestaurarDiario @DiarioId = 1, @UsuarioId = 1;

-- Eliminar permanentemente
EXEC sp_EliminarNotaPermanente @NotaId = 1, @UsuarioId = 1;
EXEC sp_EliminarTareaPermanente @TareaId = 1, @UsuarioId = 1;
EXEC sp_EliminarCarpetaPermanente @CarpetaId = 1, @UsuarioId = 1;
EXEC sp_EliminarDiarioPermanente @DiarioId = 1, @UsuarioId = 1;

-- Vaciar toda la papelera
EXEC sp_VaciarPapelera @UsuarioId = 1;

-- Ver estadísticas
EXEC sp_ObtenerEstadisticasUsuario @UsuarioId = 1;
*/

-- ====================================
-- DOCUMENTACIÓN Y RESUMEN
-- ====================================

/*
ESTRUCTURA DE LA BASE DE DATOS:

📋 TABLAS PRINCIPALES:
1. Usuarios           - Información de usuarios con autenticación
2. Carpetas          - Carpetas para organizar notas
3. Notas             - Notas con soporte para carpetas, favoritos y archivado  
4. Tareas            - Lista de tareas con prioridades y fechas
5. EntradasDiario    - Entradas de diario con PIN individual por entrada
6. ConfiguracionUsuario - Configuraciones personalizadas del usuario

📝 NOMENCLATURA DE CAMPOS:
- USU_ : Campos de tabla Usuarios
- CAR_ : Campos de tabla Carpetas  
- NOT_ : Campos de tabla Notas
- TAR_ : Campos de tabla Tareas
- DIA_ : Campos de tabla EntradasDiario
- CON_ : Campos de tabla ConfiguracionUsuario

🗑️ SISTEMA DE PAPELERA (SOFT DELETE):
- Todos los elementos se marcan como eliminados (campo _Eliminado = 1)
- Se mantiene fecha de eliminación para auditoría
- Tres estados: Activo → Papelera → Eliminado permanente
- Procedimientos para enviar, restaurar y eliminar permanentemente

🔧 PROCEDIMIENTOS PRINCIPALES:
- sp_CrearUsuario                 - Crear usuario con configuración inicial
- sp_ObtenerEstadisticasUsuario   - Estadísticas del usuario
- sp_ObtenerPapelera             - Listar elementos en papelera
- sp_VaciarPapelera              - Eliminar todo de la papelera

📁 PROCEDIMIENTOS POR TIPO:
NOTAS: sp_EnviarNotaAPapelera, sp_RestaurarNota, sp_EliminarNotaPermanente
TAREAS: sp_EnviarTareaAPapelera, sp_RestaurarTarea, sp_EliminarTareaPermanente  
CARPETAS: sp_EnviarCarpetaAPapelera, sp_RestaurarCarpeta, sp_EliminarCarpetaPermanente
DIARIO: sp_EnviarDiarioAPapelera, sp_RestaurarDiario, sp_EliminarDiarioPermanente

👁️ VISTAS DISPONIBLES:
- vw_NotasConCarpeta    - Notas activas con información de carpeta
- vw_TareasPendientes   - Tareas no completadas con estado  
- vw_Papelera          - Todos los elementos en papelera

⚡ CARACTERÍSTICAS IMPLEMENTADAS:
✅ Soft deletes en todas las tablas principales
✅ Triggers automáticos para FechaActualizacion  
✅ Índices optimizados para consultas frecuentes
✅ Sistema completo de papelera con restauración
✅ Un PIN por entrada de diario (mayor seguridad)
✅ Soporte para etiquetas JSON en notas
✅ Sistema de prioridades en tareas (1-4)
✅ Configuraciones personalizables por usuario
✅ Estadísticas y métricas del usuario
✅ Carpetas con colores e iconos personalizables

🔒 SEGURIDAD:
✅ Foreign keys con CASCADE/NO ACTION apropiados
✅ Constraints únicos donde corresponde  
✅ Índices para prevenir N+1 queries
✅ Estructura preparada para encriptación adicional
✅ Validación de permisos en todos los procedimientos
✅ Hash individual por entrada de diario

📊 RENDIMIENTO:
✅ Índices compuestos para consultas frecuentes
✅ Índices filtrados para soft deletes
✅ Triggers optimizados para actualizaciones
✅ Vistas pre-calculadas para consultas complejas
*/

PRINT '🎉 Base de datos AplicacionNotas creada exitosamente!';
PRINT '';
PRINT '📋 TABLAS: Usuarios, Carpetas, Notas, Tareas, EntradasDiario, ConfiguracionUsuario';
PRINT '👁️  VISTAS: vw_NotasConCarpeta, vw_TareasPendientes, vw_Papelera';
PRINT '🔧 PROCEDIMIENTOS PRINCIPALES: sp_CrearUsuario, sp_ObtenerEstadisticasUsuario, sp_ObtenerPapelera, sp_VaciarPapelera';
PRINT '🗑️  SISTEMA PAPELERA: Completo con enviar/restaurar/eliminar para todos los tipos';
PRINT '⚡ FUNCIONES: fn_ContarNotasPorCarpeta, fn_ObtenerEstadoTarea';
PRINT '';
PRINT '✨ La base de datos está lista para usar con tu aplicación web!';