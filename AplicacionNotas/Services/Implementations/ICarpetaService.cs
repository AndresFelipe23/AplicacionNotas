using AplicacionNotas.Models.DTOs.Carpetas;

namespace AplicacionNotas.Services.Implementations
{
    public interface ICarpetaService
    {
        Task<IEnumerable<CarpetaDto>> GetCarpetasAsync(int usuarioId);
        Task<CarpetaDto?> GetCarpetaByIdAsync(int carpetaId, int usuarioId);
        Task<CarpetaDto> CreateCarpetaAsync(CrearCarpetaDto request, int usuarioId);
        Task<CarpetaDto?> UpdateCarpetaAsync(int carpetaId, CrearCarpetaDto request, int usuarioId);
        Task<bool> DeleteCarpetaAsync(int carpetaId, int usuarioId);
        Task<bool> RestaurarCarpetaAsync(int carpetaId, int usuarioId);
        Task<bool> ReordenarCarpetasAsync(List<ReordenarCarpetaDto> carpetas, int usuarioId);
    }
}
