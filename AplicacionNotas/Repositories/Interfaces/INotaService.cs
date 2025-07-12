using AplicacionNotas.Models.DTOs.Notas;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface INotaService
    {
        Task<IEnumerable<NotaDto>> GetNotasAsync(int usuarioId);
        Task<NotaDto?> GetNotaByIdAsync(int notaId, int usuarioId);
        Task<NotaDto> CreateNotaAsync(CrearNotaDto request, int usuarioId);
        Task<NotaDto?> UpdateNotaAsync(int notaId, ActualizarNotaDto request, int usuarioId);
        Task<bool> DeleteNotaAsync(int notaId, int usuarioId);
        Task<bool> RestaurarNotaAsync(int notaId, int usuarioId);
        Task<IEnumerable<NotaDto>> GetNotasFavoritasAsync(int usuarioId);
        Task<IEnumerable<NotaDto>> GetNotasArchivadasAsync(int usuarioId);
        Task<bool> ToggleFavoritoAsync(int notaId, int usuarioId);
        Task<bool> ToggleArchivadoAsync(int notaId, int usuarioId);
        Task<IEnumerable<NotaDto>> SearchNotasAsync(string termino, int usuarioId);
    }
}
