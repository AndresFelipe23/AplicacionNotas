using AplicacionNotas.Data;
using AplicacionNotas.Models.DTOs.Papelera;
using AplicacionNotas.Repositories.Interfaces;
using Dapper;
using Microsoft.AspNetCore.Connections;
using System.Data;

namespace AplicacionNotas.Repositories.Implementations
{
    public class PapeleraRepository : IPapeleraRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public PapeleraRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<ElementoPapeleraDto>> GetPapeleraAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var elementos = await connection.QueryAsync<ElementoPapeleraDto>(
                "sp_ObtenerPapelera",
                new { UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return elementos;
        }

        public async Task<dynamic> VaciarPapeleraAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_VaciarPapelera",
                new { UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );

            return result;
        }

        public async Task<bool> RestaurarElementoAsync(string tipo, int elementoId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            string procedimiento = tipo.ToLower() switch
            {
                "nota" => "sp_RestaurarNota",
                "tarea" => "sp_RestaurarTarea",
                "carpeta" => "sp_RestaurarCarpeta",
                "diario" => "sp_RestaurarDiario",
                _ => throw new ArgumentException($"Tipo de elemento no válido: {tipo}")
            };

            var parameters = new DynamicParameters();
            parameters.Add("UsuarioId", usuarioId);

            switch (tipo.ToLower())
            {
                case "nota":
                    parameters.Add("NotaId", elementoId);
                    break;
                case "tarea":
                    parameters.Add("TareaId", elementoId);
                    break;
                case "carpeta":
                    parameters.Add("CarpetaId", elementoId);
                    parameters.Add("RestaurarNotas", true);
                    break;
                case "diario":
                    parameters.Add("DiarioId", elementoId);
                    break;
            }

            var result = await connection.QueryFirstAsync<dynamic>(
                procedimiento,
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }

        public async Task<bool> EliminarPermanenteAsync(string tipo, int elementoId, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            string procedimiento = tipo.ToLower() switch
            {
                "nota" => "sp_EliminarNotaPermanente",
                "tarea" => "sp_EliminarTareaPermanente",
                "carpeta" => "sp_EliminarCarpetaPermanente",
                "diario" => "sp_EliminarDiarioPermanente",
                _ => throw new ArgumentException($"Tipo de elemento no válido: {tipo}")
            };

            var parameters = new DynamicParameters();
            parameters.Add("UsuarioId", usuarioId);

            switch (tipo.ToLower())
            {
                case "nota":
                    parameters.Add("NotaId", elementoId);
                    break;
                case "tarea":
                    parameters.Add("TareaId", elementoId);
                    break;
                case "carpeta":
                    parameters.Add("CarpetaId", elementoId);
                    break;
                case "diario":
                    parameters.Add("DiarioId", elementoId);
                    break;
            }

            var result = await connection.QueryFirstAsync<dynamic>(
                procedimiento,
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.FilasAfectadas > 0;
        }
    }
}
