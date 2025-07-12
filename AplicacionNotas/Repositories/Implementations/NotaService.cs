using AplicacionNotas.Models.DTOs.Notas;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using AutoMapper;
using Newtonsoft.Json;

namespace AplicacionNotas.Repositories.Implementations
{
    public class NotaService : INotaService
    {
        private readonly INotaRepository _notaRepository;
        private readonly IMapper _mapper;

        public NotaService(INotaRepository notaRepository, IMapper mapper)
        {
            _notaRepository = notaRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<NotaDto>> GetNotasAsync(int usuarioId)
        {
            return await _notaRepository.GetNotasConCarpetaAsync(usuarioId);
        }

        public async Task<NotaDto?> GetNotaByIdAsync(int notaId, int usuarioId)
        {
            return await _notaRepository.GetByIdAsync(notaId, usuarioId);
        }

        public async Task<NotaDto> CreateNotaAsync(CrearNotaDto request, int usuarioId)
        {
            // Validaciones adicionales
            if (string.IsNullOrWhiteSpace(request.Titulo))
            {
                throw new ArgumentException("El título es requerido");
            }

            if (request.Titulo.Length > 500)
            {
                throw new ArgumentException("El título no puede exceder 500 caracteres");
            }

            if (!string.IsNullOrEmpty(request.Contenido) && request.Contenido.Length > 10000)
            {
                throw new ArgumentException("El contenido no puede exceder 10,000 caracteres");
            }

            if (request.Etiquetas != null && request.Etiquetas.Count > 10)
            {
                throw new ArgumentException("No se pueden agregar más de 10 etiquetas");
            }

            var nota = _mapper.Map<Nota>(request);
            nota.NotUsuarioId = usuarioId;
            nota.NotFechaCreacion = DateTime.UtcNow;
            nota.NotFechaActualizacion = DateTime.UtcNow;

            // Serializar etiquetas a JSON - manejar caso de etiquetas vacías
            if (request.Etiquetas != null && request.Etiquetas.Any())
            {
                nota.NotEtiquetas = JsonConvert.SerializeObject(request.Etiquetas);
            }
            else
            {
                // Si no hay etiquetas, establecer como null
                nota.NotEtiquetas = null;
            }

            var notaId = await _notaRepository.CreateAsync(nota, usuarioId);

            var notaCreada = await _notaRepository.GetByIdAsync(notaId, usuarioId);
            return notaCreada ?? throw new InvalidOperationException("Error al crear la nota");
        }

        public async Task<NotaDto?> UpdateNotaAsync(int notaId, ActualizarNotaDto request, int usuarioId)
        {
            try
            {
                var notaExistente = await _notaRepository.GetByIdAsync(notaId, usuarioId);
                if (notaExistente is null)
                {
                    return null;
                }

                var nota = _mapper.Map<Nota>(request);
                nota.NotId = notaId;
                nota.NotUsuarioId = usuarioId;

                // Serializar etiquetas a JSON - manejar caso de etiquetas vacías
                if (request.Etiquetas != null && request.Etiquetas.Any())
                {
                    nota.NotEtiquetas = JsonConvert.SerializeObject(request.Etiquetas);
                }
                else
                {
                    // Si no hay etiquetas, establecer como null o string vacío
                    nota.NotEtiquetas = null;
                }

                var actualizada = await _notaRepository.UpdateAsync(nota, usuarioId);
                if (!actualizada)
                {
                    return null;
                }

                return await _notaRepository.GetByIdAsync(notaId, usuarioId);
            }
            catch (Exception ex)
            {
                // Log del error para diagnóstico
                Console.WriteLine($"Error en UpdateNotaAsync: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<bool> DeleteNotaAsync(int notaId, int usuarioId)
        {
            return await _notaRepository.EnviarAPapeleraAsync(notaId, usuarioId);
        }

        public async Task<bool> RestaurarNotaAsync(int notaId, int usuarioId)
        {
            return await _notaRepository.RestaurarNotaAsync(notaId, usuarioId);
        }

        public async Task<IEnumerable<NotaDto>> GetNotasFavoritasAsync(int usuarioId)
        {
            return await _notaRepository.GetFavoritasAsync(usuarioId);
        }

        public async Task<IEnumerable<NotaDto>> GetNotasArchivadasAsync(int usuarioId)
        {
            return await _notaRepository.GetArchivadasAsync(usuarioId);
        }

        public async Task<bool> ToggleFavoritoAsync(int notaId, int usuarioId)
        {
            return await _notaRepository.ToggleFavoritoAsync(notaId, usuarioId);
        }

        public async Task<bool> ToggleArchivadoAsync(int notaId, int usuarioId)
        {
            return await _notaRepository.ToggleArchivadoAsync(notaId, usuarioId);
        }

        public async Task<IEnumerable<NotaDto>> SearchNotasAsync(string termino, int usuarioId)
        {
            var todasLasNotas = await _notaRepository.GetNotasConCarpetaAsync(usuarioId);

            if (string.IsNullOrWhiteSpace(termino))
            {
                return todasLasNotas;
            }

            var terminoBusqueda = termino.ToLower();

            return todasLasNotas.Where(nota =>
                nota.Titulo.ToLower().Contains(terminoBusqueda) ||
                (nota.Contenido?.ToLower().Contains(terminoBusqueda) ?? false) ||
                (nota.NombreCarpeta?.ToLower().Contains(terminoBusqueda) ?? false) ||
                (nota.Etiquetas?.Any(etiqueta => etiqueta.ToLower().Contains(terminoBusqueda)) ?? false)
            );
        }
    }
}
