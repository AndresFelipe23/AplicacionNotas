using AplicacionNotas.Data;
using AplicacionNotas.Models.DTOs.Notas;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using Dapper;
using Microsoft.AspNetCore.Connections;
using Newtonsoft.Json;
using System.Data;

namespace AplicacionNotas.Repositories.Implementations
{
    public class NotaRepository : INotaRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public NotaRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        // DTO temporal para mapeo de base de datos
        private class NotaDtoTemp
        {
            public int Id { get; set; }
            public int UsuarioId { get; set; }
            public string Titulo { get; set; } = string.Empty;
            public string? Contenido { get; set; }
            public bool Favorito { get; set; }
            public bool Archivado { get; set; }
            public string? Etiquetas { get; set; } // String JSON
            public DateTime FechaCreacion { get; set; }
            public DateTime FechaActualizacion { get; set; }
            public int? CarpetaId { get; set; }
            public string? NombreCarpeta { get; set; }
            public string? ColorCarpeta { get; set; }
        }

        public async Task<IEnumerable<NotaDto>> GetNotasConCarpetaAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT Id, UsuarioId, Titulo, Contenido, Favorito, Archivado, 
                       Etiquetas, FechaCreacion, FechaActualizacion, 
                       CarpetaId, NombreCarpeta, ColorCarpeta
                FROM vw_NotasConCarpeta 
                WHERE UsuarioId = @UsuarioId
                ORDER BY FechaCreacion DESC";

            var notasTemp = await connection.QueryAsync<NotaDtoTemp>(sql, new { UsuarioId = usuarioId });

            // Convertir a NotaDto con deserialización de etiquetas
            var notas = new List<NotaDto>();
            foreach (var notaTemp in notasTemp)
            {
                var nota = new NotaDto
                {
                    Id = notaTemp.Id,
                    UsuarioId = notaTemp.UsuarioId,
                    Titulo = notaTemp.Titulo,
                    Contenido = notaTemp.Contenido,
                    Favorito = notaTemp.Favorito,
                    Archivado = notaTemp.Archivado,
                    FechaCreacion = notaTemp.FechaCreacion,
                    FechaActualizacion = notaTemp.FechaActualizacion,
                    CarpetaId = notaTemp.CarpetaId,
                    NombreCarpeta = notaTemp.NombreCarpeta,
                    ColorCarpeta = notaTemp.ColorCarpeta,
                    Etiquetas = DeserializarEtiquetas(notaTemp.Etiquetas)
                };
                notas.Add(nota);
            }

            return notas;
        }

        public async Task<NotaDto?> GetByIdAsync(int notaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT Id, UsuarioId, Titulo, Contenido, Favorito, Archivado, 
                       Etiquetas, FechaCreacion, FechaActualizacion, 
                       CarpetaId, NombreCarpeta, ColorCarpeta
                FROM vw_NotasConCarpeta 
                WHERE Id = @NotaId AND UsuarioId = @UsuarioId";

            var notaTemp = await connection.QueryFirstOrDefaultAsync<NotaDtoTemp>(sql,
                new { NotaId = notaId, UsuarioId = usuarioId });

            if (notaTemp == null) return null;

            return new NotaDto
            {
                Id = notaTemp.Id,
                UsuarioId = notaTemp.UsuarioId,
                Titulo = notaTemp.Titulo,
                Contenido = notaTemp.Contenido,
                Favorito = notaTemp.Favorito,
                Archivado = notaTemp.Archivado,
                FechaCreacion = notaTemp.FechaCreacion,
                FechaActualizacion = notaTemp.FechaActualizacion,
                CarpetaId = notaTemp.CarpetaId,
                NombreCarpeta = notaTemp.NombreCarpeta,
                ColorCarpeta = notaTemp.ColorCarpeta,
                Etiquetas = DeserializarEtiquetas(notaTemp.Etiquetas)
            };
        }

        public async Task<int> CreateAsync(Nota nota, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                INSERT INTO Notas (NOT_UsuarioId, NOT_CarpetaId, NOT_Titulo, NOT_Contenido, 
                                  NOT_Favorito, NOT_Etiquetas, NOT_FechaCreacion, NOT_FechaActualizacion)
                VALUES (@UsuarioId, @CarpetaId, @Titulo, @Contenido, @Favorito, @Etiquetas, GETDATE(), GETDATE());
                SELECT SCOPE_IDENTITY();";

            var id = await connection.QueryFirstAsync<int>(sql, new
            {
                UsuarioId = usuarioId,
                CarpetaId = nota.NotCarpetaId,
                Titulo = nota.NotTitulo,
                Contenido = nota.NotContenido,
                Favorito = nota.NotFavorito,
                Etiquetas = nota.NotEtiquetas
            });

            return id;
        }

        public async Task<bool> UpdateAsync(Nota nota, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                UPDATE Notas 
                SET NOT_CarpetaId = @CarpetaId, 
                    NOT_Titulo = @Titulo, 
                    NOT_Contenido = @Contenido, 
                    NOT_Favorito = @Favorito, 
                    NOT_Etiquetas = @Etiquetas,
                    NOT_FechaActualizacion = GETDATE()
                WHERE NOT_Id = @NotaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 0";

            var filasAfectadas = await connection.ExecuteAsync(sql, new
            {
                NotaId = nota.NotId,
                UsuarioId = usuarioId,
                CarpetaId = nota.NotCarpetaId,
                Titulo = nota.NotTitulo,
                Contenido = nota.NotContenido,
                Favorito = nota.NotFavorito,
                Etiquetas = nota.NotEtiquetas
            });

            return filasAfectadas > 0;
        }

        public async Task<bool> EnviarAPapeleraAsync(int notaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_EnviarNotaAPapelera",
                new { NotaId = notaId, UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<bool> RestaurarNotaAsync(int notaId, int usuarioId)
        {
            return await RestaurarAsync(notaId, usuarioId);
        }

        public async Task<bool> RestaurarAsync(int notaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_RestaurarNota",
                new { NotaId = notaId, UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<bool> EliminarPermanenteAsync(int notaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_EliminarNotaPermanente",
                new { NotaId = notaId, UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<IEnumerable<NotaDto>> GetFavoritasAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT Id, UsuarioId, Titulo, Contenido, Favorito, Archivado, 
                       Etiquetas, FechaCreacion, FechaActualizacion, 
                       CarpetaId, NombreCarpeta, ColorCarpeta
                FROM vw_NotasConCarpeta 
                WHERE UsuarioId = @UsuarioId AND Favorito = 1
                ORDER BY FechaCreacion DESC";

            var notasTemp = await connection.QueryAsync<NotaDtoTemp>(sql, new { UsuarioId = usuarioId });

            // Convertir a NotaDto con deserialización de etiquetas
            var notas = new List<NotaDto>();
            foreach (var notaTemp in notasTemp)
            {
                var nota = new NotaDto
                {
                    Id = notaTemp.Id,
                    UsuarioId = notaTemp.UsuarioId,
                    Titulo = notaTemp.Titulo,
                    Contenido = notaTemp.Contenido,
                    Favorito = notaTemp.Favorito,
                    Archivado = notaTemp.Archivado,
                    FechaCreacion = notaTemp.FechaCreacion,
                    FechaActualizacion = notaTemp.FechaActualizacion,
                    CarpetaId = notaTemp.CarpetaId,
                    NombreCarpeta = notaTemp.NombreCarpeta,
                    ColorCarpeta = notaTemp.ColorCarpeta,
                    Etiquetas = DeserializarEtiquetas(notaTemp.Etiquetas)
                };
                notas.Add(nota);
            }

            return notas;
        }

        public async Task<IEnumerable<NotaDto>> GetArchivadasAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT Id, UsuarioId, Titulo, Contenido, Favorito, Archivado, 
                       Etiquetas, FechaCreacion, FechaActualizacion, 
                       CarpetaId, NombreCarpeta, ColorCarpeta
                FROM vw_NotasConCarpeta 
                WHERE UsuarioId = @UsuarioId AND Archivado = 1
                ORDER BY FechaCreacion DESC";

            var notasTemp = await connection.QueryAsync<NotaDtoTemp>(sql, new { UsuarioId = usuarioId });

            // Convertir a NotaDto con deserialización de etiquetas
            var notas = new List<NotaDto>();
            foreach (var notaTemp in notasTemp)
            {
                var nota = new NotaDto
                {
                    Id = notaTemp.Id,
                    UsuarioId = notaTemp.UsuarioId,
                    Titulo = notaTemp.Titulo,
                    Contenido = notaTemp.Contenido,
                    Favorito = notaTemp.Favorito,
                    Archivado = notaTemp.Archivado,
                    FechaCreacion = notaTemp.FechaCreacion,
                    FechaActualizacion = notaTemp.FechaActualizacion,
                    CarpetaId = notaTemp.CarpetaId,
                    NombreCarpeta = notaTemp.NombreCarpeta,
                    ColorCarpeta = notaTemp.ColorCarpeta,
                    Etiquetas = DeserializarEtiquetas(notaTemp.Etiquetas)
                };
                notas.Add(nota);
            }

            return notas;
        }

        public async Task<bool> ToggleFavoritoAsync(int notaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                UPDATE Notas 
                SET NOT_Favorito = CASE WHEN NOT_Favorito = 1 THEN 0 ELSE 1 END,
                    NOT_FechaActualizacion = GETDATE()
                WHERE NOT_Id = @NotaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 0";

            var filasAfectadas = await connection.ExecuteAsync(sql, new { NotaId = notaId, UsuarioId = usuarioId });
            return filasAfectadas > 0;
        }

        public async Task<bool> ToggleArchivadoAsync(int notaId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                UPDATE Notas 
                SET NOT_Archivado = CASE WHEN NOT_Archivado = 1 THEN 0 ELSE 1 END,
                    NOT_FechaActualizacion = GETDATE()
                WHERE NOT_Id = @NotaId AND NOT_UsuarioId = @UsuarioId AND NOT_Eliminado = 0";

            var filasAfectadas = await connection.ExecuteAsync(sql, new { NotaId = notaId, UsuarioId = usuarioId });
            return filasAfectadas > 0;
        }

        private List<string> DeserializarEtiquetas(string? etiquetasJson)
        {
            if (string.IsNullOrEmpty(etiquetasJson))
                return new List<string>();

            try
            {
                return JsonConvert.DeserializeObject<List<string>>(etiquetasJson) ?? new List<string>();
            }
            catch
            {
                return new List<string>();
            }
        }
    }
}
