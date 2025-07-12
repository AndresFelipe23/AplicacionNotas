using AplicacionNotas.Models.DTOs.Diario;
using AplicacionNotas.Models.Entities;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface IDiarioRepository
    {
        // Todos los métodos usan procedimientos almacenados (SP)
        Task<IEnumerable<DiarioEntradaDto>> GetEntradasAsync(int usuarioId, int mes, int año); // SP: sp_ObtenerEntradasDiarioPorUsuario
        Task<DiarioEntradaDto?> GetEntradaByDateAsync(DateTime fecha, int usuarioId); // SP: sp_ObtenerEntradaDiarioPorFecha
        Task<int> CreateEntradaAsync(EntradasDiario entrada, int usuarioId); // SP: sp_CrearEntradaDiario
        Task<bool> UpdateEntradaAsync(EntradasDiario entrada, int usuarioId); // SP: sp_ActualizarEntradaDiario
        Task<bool> EnviarAPapeleraAsync(int diarioId, int usuarioId); // SP: sp_EliminarEntradaDiario
        Task<bool> RestaurarAsync(int diarioId, int usuarioId); // SP: sp_RestaurarEntradaDiario
        Task<bool> EliminarPermanenteAsync(int diarioId, int usuarioId); // (Si tienes un SP para borrado permanente)
        Task<bool> VerificarPinAsync(DateTime fecha, string pinHash, int usuarioId); // (Puede ser SP o consulta directa)
    }
}
