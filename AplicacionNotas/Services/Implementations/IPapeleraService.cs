using AplicacionNotas.Models.DTOs.Papelera;

namespace AplicacionNotas.Services.Implementations
{
    public interface IPapeleraService
    {
        Task<IEnumerable<ElementoPapeleraDto>> GetElementosAsync(int usuarioId);
        Task<bool> RestaurarElementoAsync(string tipo, int elementoId, int usuarioId);
        Task<bool> EliminarPermanenteAsync(string tipo, int elementoId, int usuarioId);
        Task<dynamic> VaciarPapeleraAsync(int usuarioId);
        Task<int> GetContadorPapeleraAsync(int usuarioId);
    }
}
