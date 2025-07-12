using AplicacionNotas.Data;
using AplicacionNotas.Models.DTOs.Tareas;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using Dapper;
using Microsoft.AspNetCore.Connections;
using System.Data;

namespace AplicacionNotas.Repositories.Implementations
{
    public class TareaRepository : ITareaRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public TareaRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<TareaDto>> GetTareasPendientesAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT Id, UsuarioId, Titulo, Descripcion, Prioridad, 
                       FechaVencimiento, FechaCreacion, Estado
                FROM vw_TareasPendientes 
                WHERE UsuarioId = @UsuarioId
                ORDER BY 
                    CASE 
                        WHEN Estado = 'Vencida' THEN 1
                        WHEN Estado = 'Urgente' THEN 2
                        WHEN Estado = 'Próxima' THEN 3
                        ELSE 4
                    END,
                    Prioridad DESC,
                    FechaVencimiento ASC";

            var tareas = await connection.QueryAsync<TareaDto>(sql, new { UsuarioId = usuarioId });

            // Mapear prioridad a texto
            foreach (var tarea in tareas)
            {
                tarea.PrioridadTexto = tarea.Prioridad switch
                {
                    1 => "Baja",
                    2 => "Media",
                    3 => "Alta",
                    4 => "Urgente",
                    _ => "Normal"
                };
            }

            return tareas;
        }

        public async Task<IEnumerable<TareaDto>> GetTareasCompletadasAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT TAR_Id as Id, TAR_UsuarioId as UsuarioId, TAR_Titulo as Titulo, 
                       TAR_Descripcion as Descripcion, TAR_Prioridad as Prioridad,
                       TAR_FechaVencimiento as FechaVencimiento, TAR_FechaCompletada as FechaCompletada,
                       TAR_FechaCreacion as FechaCreacion, 1 as Completada
                FROM Tareas 
                WHERE TAR_UsuarioId = @UsuarioId AND TAR_Completada = 1 AND TAR_Eliminado = 0
                ORDER BY TAR_FechaCompletada DESC";

            var tareas = await connection.QueryAsync<TareaDto>(sql, new { UsuarioId = usuarioId });

            foreach (var tarea in tareas)
            {
                tarea.PrioridadTexto = tarea.Prioridad switch
                {
                    1 => "Baja",
                    2 => "Media",
                    3 => "Alta",
                    4 => "Urgente",
                    _ => "Normal"
                };
                tarea.Estado = "Completada";
            }

            return tareas;
        }

        public async Task<TareaDto?> GetByIdAsync(int tareaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT TAR_Id as Id, TAR_UsuarioId as UsuarioId, TAR_Titulo as Titulo, 
                       TAR_Descripcion as Descripcion, TAR_Completada as Completada,
                       TAR_Prioridad as Prioridad, TAR_FechaVencimiento as FechaVencimiento,
                       TAR_FechaCompletada as FechaCompletada, TAR_FechaCreacion as FechaCreacion,
                       TAR_Estado as Estado
                FROM Tareas 
                WHERE TAR_Id = @TareaId AND TAR_UsuarioId = @UsuarioId AND TAR_Eliminado = 0";

            var tarea = await connection.QueryFirstOrDefaultAsync<TareaDto>(sql,
                new { TareaId = tareaId, UsuarioId = usuarioId });

            if (tarea != null)
            {
                tarea.PrioridadTexto = tarea.Prioridad switch
                {
                    1 => "Baja",
                    2 => "Media",
                    3 => "Alta",
                    4 => "Urgente",
                    _ => "Normal"
                };

                // Si no tiene estado definido, calcularlo basado en otros campos
                if (string.IsNullOrEmpty(tarea.Estado))
                {
                    if (tarea.Completada)
                    {
                        tarea.Estado = "completada";
                    }
                    else if (tarea.FechaVencimiento == null)
                    {
                        tarea.Estado = "pendiente";
                    }
                    else if (tarea.FechaVencimiento < DateTime.Now)
                    {
                        tarea.Estado = "vencida";
                    }
                    else if (tarea.FechaVencimiento <= DateTime.Now.AddDays(1))
                    {
                        tarea.Estado = "urgente";
                    }
                    else if (tarea.FechaVencimiento <= DateTime.Now.AddDays(7))
                    {
                        tarea.Estado = "próxima";
                    }
                    else
                    {
                        tarea.Estado = "normal";
                    }
                }
            }

            return tarea;
        }

        public async Task<int> CreateAsync(Tarea tarea, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_CrearTarea",
                new
                {
                    UsuarioId = usuarioId,
                    Titulo = tarea.TarTitulo,
                    Descripcion = tarea.TarDescripcion,
                    Prioridad = tarea.TarPrioridad,
                    FechaVencimiento = tarea.TarFechaVencimiento,
                    Estado = tarea.TarEstado
                },
                commandType: CommandType.StoredProcedure
            );

            // Convertir el resultado a int
            return Convert.ToInt32(result.TareaId);
        }

        public async Task<bool> UpdateAsync(Tarea tarea, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_ActualizarTarea",
                new
                {
                    TareaId = tarea.TarId,
                    UsuarioId = usuarioId,
                    Titulo = tarea.TarTitulo,
                    Descripcion = tarea.TarDescripcion,
                    Prioridad = tarea.TarPrioridad,
                    FechaVencimiento = tarea.TarFechaVencimiento,
                    Estado = tarea.TarEstado
                },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<bool> ToggleCompletadaAsync(int tareaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                UPDATE Tareas 
                SET TAR_Completada = CASE WHEN TAR_Completada = 1 THEN 0 ELSE 1 END,
                    TAR_FechaCompletada = CASE WHEN TAR_Completada = 1 THEN NULL ELSE GETDATE() END,
                    TAR_FechaActualizacion = GETDATE()
                WHERE TAR_Id = @TareaId AND TAR_UsuarioId = @UsuarioId AND TAR_Eliminado = 0";

            var filasAfectadas = await connection.ExecuteAsync(sql, new { TareaId = tareaId, UsuarioId = usuarioId });
            return filasAfectadas > 0;
        }

        public async Task<bool> EnviarAPapeleraAsync(int tareaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_EnviarTareaAPapelera",
                new { TareaId = tareaId, UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<bool> RestaurarTareaAsync(int tareaId, int usuarioId)
        {
            return await RestaurarAsync(tareaId, usuarioId);
        }

        public async Task<bool> RestaurarAsync(int tareaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_RestaurarTarea",
                new { TareaId = tareaId, UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<bool> EliminarPermanenteAsync(int tareaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_EliminarTareaPermanente",
                new { TareaId = tareaId, UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        // Nuevos métodos para el flujo Kanban
        public async Task<IEnumerable<TareaDto>> GetTareasPorEstadoAsync(int usuarioId, string estado)
        {
            using var connection = _connectionFactory.CreateConnection();

            var tareas = await connection.QueryAsync<TareaDto>(
                "sp_ObtenerTareasPorEstado",
                new { UsuarioId = usuarioId, Estado = estado },
                commandType: CommandType.StoredProcedure
            );

            foreach (var tarea in tareas)
            {
                tarea.PrioridadTexto = tarea.Prioridad switch
                {
                    1 => "Baja",
                    2 => "Media",
                    3 => "Alta",
                    4 => "Urgente",
                    _ => "Normal"
                };
            }

            return tareas;
        }

        public async Task<bool> CambiarEstadoAsync(int tareaId, string nuevoEstado, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_CambiarEstadoTarea",
                new 
            { 
                TareaId = tareaId, 
                UsuarioId = usuarioId, 
                NuevoEstado = nuevoEstado 
            },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<IEnumerable<TareaDto>> GetTareasKanbanAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var tareas = await connection.QueryAsync<TareaDto>(
                "sp_ObtenerTareasKanban",
                new { UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            foreach (var tarea in tareas)
            {
                tarea.PrioridadTexto = tarea.Prioridad switch
                {
                    1 => "Baja",
                    2 => "Media",
                    3 => "Alta",
                    4 => "Urgente",
                    _ => "Normal"
                };
            }

            return tareas;
        }
    }
}
