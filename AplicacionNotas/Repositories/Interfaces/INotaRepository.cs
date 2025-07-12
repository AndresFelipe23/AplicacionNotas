using AplicacionNotas.Models.DTOs.Notas;
using AplicacionNotas.Models.Entities;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface INotaRepository
    {
        Task<IEnumerable<NotaDto>> GetNotasConCarpetaAsync(int usuarioId);
        Task<NotaDto?> GetByIdAsync(int notaId, int usuarioId);
        Task<int> CreateAsync(Nota nota, int usuarioId);
        Task<bool> UpdateAsync(Nota nota, int usuarioId);
        Task<bool> EnviarAPapeleraAsync(int notaId, int usuarioId);
        Task<bool> RestaurarNotaAsync(int notaId, int usuarioId);
        Task<bool> RestaurarAsync(int notaId, int usuarioId);
        Task<bool> EliminarPermanenteAsync(int notaId, int usuarioId);
        Task<IEnumerable<NotaDto>> GetFavoritasAsync(int usuarioId);
        Task<IEnumerable<NotaDto>> GetArchivadasAsync(int usuarioId);
        Task<bool> ToggleFavoritoAsync(int notaId, int usuarioId);
        Task<bool> ToggleArchivadoAsync(int notaId, int usuarioId);
    }
}
