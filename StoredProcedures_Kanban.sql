-- =============================================
-- STORED PROCEDURES PARA FLUJO KANBAN DE TAREAS
-- =============================================

-- 1. SP para crear tareas con estado
-- =============================================
CREATE PROCEDURE [dbo].[sp_CrearTarea]
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
GO

-- 2. SP para actualizar tareas incluyendo estado
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
GO

-- 3. SP para cambiar estado de tarea (drag & drop)
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
GO

-- 4. SP para obtener tareas por estado específico
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
GO

-- 5. SP para obtener todas las tareas organizadas por estado (Kanban completo)
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
GO

-- 6. SP para obtener estadísticas de tareas por estado
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerEstadisticasKanban]
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        SELECT 
            'pendiente' as Estado,
            COUNT(*) as Cantidad
        FROM Tareas 
        WHERE TAR_UsuarioId = @UsuarioId 
          AND TAR_Eliminado = 0 
          AND TAR_Estado = 'pendiente'
        
        UNION ALL
        
        SELECT 
            'en_progreso' as Estado,
            COUNT(*) as Cantidad
        FROM Tareas 
        WHERE TAR_UsuarioId = @UsuarioId 
          AND TAR_Eliminado = 0 
          AND TAR_Estado = 'en_progreso'
        
        UNION ALL
        
        SELECT 
            'completada' as Estado,
            COUNT(*) as Cantidad
        FROM Tareas 
        WHERE TAR_UsuarioId = @UsuarioId 
          AND TAR_Eliminado = 0 
          AND TAR_Estado = 'completada';
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO

-- =============================================
-- EJEMPLOS DE USO
-- =============================================

/*
-- Crear una nueva tarea
EXEC sp_CrearTarea 
    @UsuarioId = 1,
    @Titulo = 'Implementar drag & drop',
    @Descripcion = 'Agregar funcionalidad de drag & drop al Kanban',
    @Prioridad = 3,
    @FechaVencimiento = '2024-12-31',
    @Estado = 'pendiente'

-- Cambiar estado de una tarea (drag & drop)
EXEC sp_CambiarEstadoTarea 
    @TareaId = 1,
    @UsuarioId = 1,
    @NuevoEstado = 'en_progreso'

-- Obtener tareas por estado
EXEC sp_ObtenerTareasPorEstado 
    @UsuarioId = 1,
    @Estado = 'pendiente'

-- Obtener todas las tareas para Kanban
EXEC sp_ObtenerTareasKanban 
    @UsuarioId = 1

-- Obtener estadísticas
EXEC sp_ObtenerEstadisticasKanban 
    @UsuarioId = 1
*/ 