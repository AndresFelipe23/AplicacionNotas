using AplicacionNotas.Data;
using AplicacionNotas.Helpers;
using AplicacionNotas.Models.DTOs.Diario;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using Dapper;

namespace AplicacionNotas.Services.Implementations
{
    public class DiarioService : IDiarioService
    {
        private readonly IDiarioRepository _diarioRepository;
        private readonly IPasswordHelper _passwordHelper;
        private readonly IDbConnectionFactory _connectionFactory;

        public DiarioService(
            IDiarioRepository diarioRepository,
            IPasswordHelper passwordHelper,
            IDbConnectionFactory connectionFactory)
        {
            _diarioRepository = diarioRepository;
            _passwordHelper = passwordHelper;
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<DiarioEntradaDto>> GetEntradasAsync(int usuarioId, int mes, int año)
        {
            return await _diarioRepository.GetEntradasAsync(usuarioId, mes, año);
        }

        public async Task<DiarioEntradaDto?> GetEntradaByDateAsync(DateTime fecha, int usuarioId)
        {
            return await _diarioRepository.GetEntradaByDateAsync(fecha, usuarioId);
        }

        public async Task<DiarioEntradaDto?> CreateEntradaAsync(CrearEntradaDiarioDto request, int usuarioId)
        {
            // Verificar si ya existe una entrada para esta fecha
            var entradaExistente = await _diarioRepository.GetEntradaByDateAsync(request.FechaEntrada, usuarioId);
            if (entradaExistente is not null)
            {
                return null; // Ya existe una entrada para esta fecha
            }

            // Crear entrada compatible con tu entidad EntradasDiario
            var entrada = new EntradasDiario
            {
                DiaUsuarioId = usuarioId,
                DiaFechaEntrada = DateOnly.FromDateTime(request.FechaEntrada.Date),
                DiaTitulo = request.Titulo,
                DiaContenido = request.Contenido,
                DiaEstadoAnimo = request.EstadoAnimo,
                DiaEliminado = false,
                DiaFechaCreacion = DateTime.UtcNow,
                DiaFechaActualizacion = DateTime.UtcNow
            };

            var entradaId = await _diarioRepository.CreateEntradaAsync(entrada, usuarioId);

            return await _diarioRepository.GetEntradaByDateAsync(request.FechaEntrada, usuarioId);
        }

        public async Task<DiarioEntradaDto?> UpdateEntradaAsync(DateTime fecha, ActualizarEntradaDiarioDto request, int usuarioId)
        {
            // Buscar la entrada existente para obtener el Id
            var entradaExistente = await _diarioRepository.GetEntradaByDateAsync(fecha, usuarioId);
            if (entradaExistente == null)
                return null; // No existe, no se puede actualizar

            // Crear entrada para actualización compatible con tu entidad
            var entrada = new EntradasDiario
            {
                DiaId = entradaExistente.Id, // Asigna el Id correcto
                DiaUsuarioId = usuarioId,
                DiaFechaEntrada = DateOnly.FromDateTime(fecha.Date),
                DiaTitulo = request.Titulo,
                DiaContenido = request.Contenido,
                DiaEstadoAnimo = request.EstadoAnimo
            };

            var actualizada = await _diarioRepository.UpdateEntradaAsync(entrada, usuarioId);
            if (!actualizada)
            {
                return null;
            }

            return await _diarioRepository.GetEntradaByDateAsync(fecha, usuarioId);
        }

        public async Task<bool> DeleteEntradaAsync(DateTime fecha, int usuarioId)
        {
            var entrada = await _diarioRepository.GetEntradaByDateAsync(fecha, usuarioId);
            if (entrada is null)
            {
                return false;
            }

            return await _diarioRepository.EnviarAPapeleraAsync(entrada.Id, usuarioId);
        }

        public async Task<bool> VerificarPinAsync(DateTime fecha, string pin, int usuarioId)
        {
            // Usar tu IDbConnectionFactory correctamente
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT DIA_PinHash
                FROM EntradasDiario
                WHERE DIA_UsuarioId = @UsuarioId 
                  AND DIA_FechaEntrada = @Fecha
                  AND DIA_Eliminado = 0";

            var parameters = new
            {
                UsuarioId = usuarioId,
                Fecha = DateOnly.FromDateTime(fecha.Date) // Conversión correcta para DateOnly
            };

            // Usar Dapper para obtener el hash
            var pinHashAlmacenado = await connection.QueryFirstOrDefaultAsync<string>(sql, parameters);

            if (string.IsNullOrEmpty(pinHashAlmacenado))
            {
                return false;
            }

            // Verificar PIN con BCrypt
            return _passwordHelper.VerifyPin(pin, pinHashAlmacenado);
        }
    }
}