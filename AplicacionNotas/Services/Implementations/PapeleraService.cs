using AplicacionNotas.Models.DTOs.Papelera;
using AplicacionNotas.Repositories.Interfaces;

namespace AplicacionNotas.Services.Implementations
{
    public class PapeleraService : IPapeleraService
    {
        private readonly IPapeleraRepository _papeleraRepository;

        public PapeleraService(IPapeleraRepository papeleraRepository)
        {
            _papeleraRepository = papeleraRepository;
        }

        public async Task<IEnumerable<ElementoPapeleraDto>> GetElementosAsync(int usuarioId)
        {
            return await _papeleraRepository.GetPapeleraAsync(usuarioId);
        }

        public async Task<bool> RestaurarElementoAsync(string tipo, int elementoId, int usuarioId)
        {
            var tiposValidos = new[] { "nota", "tarea", "carpeta", "diario" };
            if (!tiposValidos.Contains(tipo.ToLower()))
            {
                throw new ArgumentException($"Tipo de elemento no válido: {tipo}");
            }

            return await _papeleraRepository.RestaurarElementoAsync(tipo, elementoId, usuarioId);
        }

        public async Task<bool> EliminarPermanenteAsync(string tipo, int elementoId, int usuarioId)
        {
            var tiposValidos = new[] { "nota", "tarea", "carpeta", "diario" };
            if (!tiposValidos.Contains(tipo.ToLower()))
            {
                throw new ArgumentException($"Tipo de elemento no válido: {tipo}");
            }

            return await _papeleraRepository.EliminarPermanenteAsync(tipo, elementoId, usuarioId);
        }

        public async Task<dynamic> VaciarPapeleraAsync(int usuarioId)
        {
            return await _papeleraRepository.VaciarPapeleraAsync(usuarioId);
        }

        public async Task<int> GetContadorPapeleraAsync(int usuarioId)
        {
            var elementos = await _papeleraRepository.GetPapeleraAsync(usuarioId);
            return elementos.Count();
        }
    }
}
