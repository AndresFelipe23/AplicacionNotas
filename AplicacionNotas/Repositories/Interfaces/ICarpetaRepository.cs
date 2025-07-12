using AplicacionNotas.Models.DTOs.Carpetas;
using AplicacionNotas.Models.Entities;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface ICarpetaRepository
    {
        Task<IEnumerable<CarpetaDto>> GetCarpetasAsync(int usuarioId);
        Task<CarpetaDto?> GetByIdAsync(int carpetaId, int usuarioId);
        Task<int> CreateAsync(Carpeta carpeta, int usuarioId);
        Task<bool> UpdateAsync(Carpeta carpeta, int usuarioId);
        Task<bool> EnviarAPapeleraAsync(int carpetaId, int usuarioId);
        Task<bool> RestaurarCarpetaAsync(int carpetaId, int usuarioId);
        Task<bool> RestaurarAsync(int carpetaId, int usuarioId);
        Task<bool> EliminarPermanenteAsync(int carpetaId, int usuarioId);
        Task<bool> ReordenarAsync(List<ReordenarCarpetaDto> carpetas, int usuarioId);
    }
}
