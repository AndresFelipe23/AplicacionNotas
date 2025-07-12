using AplicacionNotas.Models.DTOs.Diario;

namespace AplicacionNotas.Services.Implementations
{
    public interface IDiarioService
    {
        Task<IEnumerable<DiarioEntradaDto>> GetEntradasAsync(int usuarioId, int mes, int año);
        Task<DiarioEntradaDto?> GetEntradaByDateAsync(DateTime fecha, int usuarioId);
        Task<DiarioEntradaDto?> CreateEntradaAsync(CrearEntradaDiarioDto request, int usuarioId);
        Task<DiarioEntradaDto?> UpdateEntradaAsync(DateTime fecha, ActualizarEntradaDiarioDto request, int usuarioId);
        Task<bool> DeleteEntradaAsync(DateTime fecha, int usuarioId);
        Task<bool> VerificarPinAsync(DateTime fecha, string pin, int usuarioId);
    }
}
