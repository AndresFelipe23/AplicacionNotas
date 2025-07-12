using AplicacionNotas.Models.DTOs.Papelera;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface IPapeleraRepository
    {
        Task<IEnumerable<ElementoPapeleraDto>> GetPapeleraAsync(int usuarioId);
        Task<dynamic> VaciarPapeleraAsync(int usuarioId);
        Task<bool> RestaurarElementoAsync(string tipo, int elementoId, int usuarioId);
        Task<bool> EliminarPermanenteAsync(string tipo, int elementoId, int usuarioId);
    }
}
