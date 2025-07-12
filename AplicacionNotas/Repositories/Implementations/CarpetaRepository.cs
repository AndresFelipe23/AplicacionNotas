using AplicacionNotas.Data;
using AplicacionNotas.Models.DTOs.Carpetas;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using Dapper;
using Microsoft.AspNetCore.Connections;
using System.Data;

namespace AplicacionNotas.Repositories.Implementations
{
    public class CarpetaRepository : ICarpetaRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public CarpetaRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<CarpetaDto>> GetCarpetasAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT 
                    c.CAR_Id as Id,
                    c.CAR_UsuarioId as UsuarioId,
                    c.CAR_Nombre as Nombre,
                    c.CAR_Descripcion as Descripcion,
                    c.CAR_Color as Color,
                    c.CAR_Icono as Icono,
                    c.CAR_Orden as Orden,
                    c.CAR_FechaCreacion as FechaCreacion,
                    dbo.fn_ContarNotasPorCarpeta(c.CAR_Id) as CantidadNotas
                FROM Carpetas c
                WHERE c.CAR_UsuarioId = @UsuarioId AND c.CAR_Eliminado = 0
                ORDER BY c.CAR_Orden, c.CAR_FechaCreacion";

            return await connection.QueryAsync<CarpetaDto>(sql, new { UsuarioId = usuarioId });
        }

        public async Task<CarpetaDto?> GetByIdAsync(int carpetaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT 
                    c.CAR_Id as Id,
                    c.CAR_UsuarioId as UsuarioId,
                    c.CAR_Nombre as Nombre,
                    c.CAR_Descripcion as Descripcion,
                    c.CAR_Color as Color,
                    c.CAR_Icono as Icono,
                    c.CAR_Orden as Orden,
                    c.CAR_FechaCreacion as FechaCreacion,
                    dbo.fn_ContarNotasPorCarpeta(c.CAR_Id) as CantidadNotas
                FROM Carpetas c
                WHERE c.CAR_Id = @CarpetaId AND c.CAR_UsuarioId = @UsuarioId AND c.CAR_Eliminado = 0";

            return await connection.QueryFirstOrDefaultAsync<CarpetaDto>(sql,
                new { CarpetaId = carpetaId, UsuarioId = usuarioId });
        }

        public async Task<int> CreateAsync(Carpeta carpeta, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                INSERT INTO Carpetas (CAR_UsuarioId, CAR_Nombre, CAR_Descripcion, CAR_Color, 
                                     CAR_Icono, CAR_Orden, CAR_FechaCreacion, CAR_FechaActualizacion)
                VALUES (@UsuarioId, @Nombre, @Descripcion, @Color, @Icono, @Orden, GETDATE(), GETDATE());
                SELECT SCOPE_IDENTITY();";

            var id = await connection.QueryFirstAsync<int>(sql, new
            {
                UsuarioId = usuarioId,
                Nombre = carpeta.CarNombre,
                Descripcion = carpeta.CarDescripcion,
                Color = carpeta.CarColor,
                Icono = carpeta.CarIcono,
                Orden = carpeta.CarOrden
            });

            return id;
        }

        public async Task<bool> UpdateAsync(Carpeta carpeta, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                UPDATE Carpetas 
                SET CAR_Nombre = @Nombre, 
                    CAR_Descripcion = @Descripcion, 
                    CAR_Color = @Color, 
                    CAR_Icono = @Icono,
                    CAR_FechaActualizacion = GETDATE()
                WHERE CAR_Id = @CarpetaId AND CAR_UsuarioId = @UsuarioId AND CAR_Eliminado = 0";

            var filasAfectadas = await connection.ExecuteAsync(sql, new
            {
                CarpetaId = carpeta.CarId,
                UsuarioId = usuarioId,
                Nombre = carpeta.CarNombre,
                Descripcion = carpeta.CarDescripcion,
                Color = carpeta.CarColor,
                Icono = carpeta.CarIcono
            });

            return filasAfectadas > 0;
        }

        public async Task<bool> EnviarAPapeleraAsync(int carpetaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_EnviarCarpetaAPapelera",
                new { CarpetaId = carpetaId, UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<bool> RestaurarCarpetaAsync(int carpetaId, int usuarioId)
        {
            return await RestaurarAsync(carpetaId, usuarioId);
        }

        public async Task<bool> RestaurarAsync(int carpetaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_RestaurarCarpeta",
                new { CarpetaId = carpetaId, UsuarioId = usuarioId, RestaurarNotas = true },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<bool> EliminarPermanenteAsync(int carpetaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_EliminarCarpetaPermanente",
                new { CarpetaId = carpetaId, UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<bool> ReordenarAsync(List<ReordenarCarpetaDto> carpetas, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var transaction = connection.BeginTransaction();

            try
            {
                foreach (var carpeta in carpetas)
                {
                    const string sql = @"
                        UPDATE Carpetas 
                        SET CAR_Orden = @Orden, CAR_FechaActualizacion = GETDATE()
                        WHERE CAR_Id = @CarpetaId AND CAR_UsuarioId = @UsuarioId AND CAR_Eliminado = 0";

                    await connection.ExecuteAsync(sql, new
                    {
                        CarpetaId = carpeta.Id,
                        Orden = carpeta.Orden,
                        UsuarioId = usuarioId
                    }, transaction);
                }

                transaction.Commit();
                return true;
            }
            catch
            {
                transaction.Rollback();
                return false;
            }
        }
    }
}
