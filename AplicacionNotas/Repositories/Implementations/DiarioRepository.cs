using AplicacionNotas.Data;
using AplicacionNotas.Models.DTOs.Diario;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using Dapper;
using Microsoft.AspNetCore.Connections;
using System.Data;

namespace AplicacionNotas.Repositories.Implementations
{
    public class DiarioRepository : IDiarioRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public DiarioRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<DiarioEntradaDto>> GetEntradasAsync(int usuarioId, int mes, int año)
        {
            using var connection = _connectionFactory.CreateConnection();
            var entradas = await connection.QueryAsync<DiarioEntradaDto>(
                "sp_ObtenerEntradasDiarioPorUsuario",
                new { UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );
            // Mapear estado de ánimo a texto y requiere PIN
            foreach (var entrada in entradas)
            {
                entrada.EstadoAnimoTexto = entrada.EstadoAnimo switch
                {
                    1 => "Muy mal",
                    2 => "Mal",
                    3 => "Regular",
                    4 => "Bien",
                    5 => "Excelente",
                    _ => "No especificado"
                };
                entrada.RequierePin = true;
            }
            return entradas;
        }

        public async Task<DiarioEntradaDto?> GetEntradaByDateAsync(DateTime fecha, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var entrada = await connection.QueryFirstOrDefaultAsync<DiarioEntradaDto>(
                "sp_ObtenerEntradaDiarioPorFecha",
                new { UsuarioId = usuarioId, FechaEntrada = fecha },
                commandType: CommandType.StoredProcedure
            );
            if (entrada != null)
            {
                entrada.EstadoAnimoTexto = entrada.EstadoAnimo switch
                {
                    1 => "Muy mal",
                    2 => "Mal",
                    3 => "Regular",
                    4 => "Bien",
                    5 => "Excelente",
                    _ => "No especificado"
                };
                entrada.RequierePin = true;
            }
            return entrada;
        }

        public async Task<int> CreateEntradaAsync(EntradasDiario entrada, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var id = await connection.QueryFirstAsync<int>(
                "sp_CrearEntradaDiario",
                new
                {
                    UsuarioId = usuarioId,
                    FechaEntrada = entrada.DiaFechaEntrada.ToDateTime(TimeOnly.MinValue),
                    Titulo = entrada.DiaTitulo,
                    Contenido = entrada.DiaContenido,
                    EstadoAnimo = entrada.DiaEstadoAnimo,
                    PinHash = entrada.DiaPinHash
                },
                commandType: CommandType.StoredProcedure
            );
            return id;
        }

        public async Task<bool> UpdateEntradaAsync(EntradasDiario entrada, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var filasAfectadas = await connection.ExecuteAsync(
                "sp_ActualizarEntradaDiario",
                new
                {
                    Id = entrada.DiaId,
                    Titulo = entrada.DiaTitulo,
                    Contenido = entrada.DiaContenido,
                    EstadoAnimo = entrada.DiaEstadoAnimo,
                    PinHash = entrada.DiaPinHash,
                    FechaEntrada = entrada.DiaFechaEntrada.ToDateTime(TimeOnly.MinValue)
                },
                commandType: CommandType.StoredProcedure
            );
            return filasAfectadas > 0;
        }

        public async Task<bool> EnviarAPapeleraAsync(int diarioId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var filasAfectadas = await connection.ExecuteAsync(
                "sp_EliminarEntradaDiario",
                new { Id = diarioId },
                commandType: CommandType.StoredProcedure
            );
            return filasAfectadas > 0;
        }

        public async Task<bool> RestaurarAsync(int diarioId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var filasAfectadas = await connection.ExecuteAsync(
                "sp_RestaurarEntradaDiario",
                new { Id = diarioId },
                commandType: CommandType.StoredProcedure
            );
            return filasAfectadas > 0;
        }

        public async Task<bool> EliminarPermanenteAsync(int diarioId, int usuarioId)
        {
            // Si tienes un SP para borrado permanente, implementa aquí
            return false;
        }

        public async Task<bool> VerificarPinAsync(DateTime fecha, string pinHash, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();
            // Puedes crear un SP para esto, o mantener la consulta directa
            const string sql = @"SELECT DIA_PinHash FROM EntradasDiario WHERE DIA_UsuarioId = @UsuarioId AND DIA_FechaEntrada = @Fecha AND DIA_Eliminado = 0";
            var pinAlmacenado = await connection.QueryFirstOrDefaultAsync<string>(sql,
                new { UsuarioId = usuarioId, Fecha = fecha.Date });
            return !string.IsNullOrEmpty(pinAlmacenado) && pinAlmacenado == pinHash;
        }
    }
}
