using AplicacionNotas.Models.DTOs.Carpetas;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using AutoMapper;

namespace AplicacionNotas.Services.Implementations
{
    public class CarpetaService : ICarpetaService
    {
        private readonly ICarpetaRepository _carpetaRepository;
        private readonly IMapper _mapper;

        public CarpetaService(ICarpetaRepository carpetaRepository, IMapper mapper)
        {
            _carpetaRepository = carpetaRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CarpetaDto>> GetCarpetasAsync(int usuarioId)
        {
            return await _carpetaRepository.GetCarpetasAsync(usuarioId);
        }

        public async Task<CarpetaDto?> GetCarpetaByIdAsync(int carpetaId, int usuarioId)
        {
            return await _carpetaRepository.GetByIdAsync(carpetaId, usuarioId);
        }

        public async Task<CarpetaDto> CreateCarpetaAsync(CrearCarpetaDto request, int usuarioId)
        {
            // Mapear DTO a entidad
            var carpeta = _mapper.Map<Carpeta>(request);
            
            // Crear carpeta en el repositorio
            var carpetaId = await _carpetaRepository.CreateAsync(carpeta, usuarioId);
            
            // Obtener la carpeta creada
            var carpetaCreada = await _carpetaRepository.GetByIdAsync(carpetaId, usuarioId);
            
            if (carpetaCreada == null)
            {
                throw new InvalidOperationException("Error al crear la carpeta");
            }
            
            return carpetaCreada;
        }

        public async Task<CarpetaDto?> UpdateCarpetaAsync(int carpetaId, CrearCarpetaDto request, int usuarioId)
        {
            // Obtener carpeta existente
            var carpetaExistente = await _carpetaRepository.GetByIdAsync(carpetaId, usuarioId);
            if (carpetaExistente == null)
            {
                return null;
            }

            // Mapear DTO a entidad
            var carpeta = _mapper.Map<Carpeta>(request);
            carpeta.CarId = carpetaId;
            carpeta.CarUsuarioId = usuarioId;

            // Actualizar carpeta
            var actualizado = await _carpetaRepository.UpdateAsync(carpeta, usuarioId);
            if (!actualizado)
            {
                return null;
            }

            // Obtener carpeta actualizada
            return await _carpetaRepository.GetByIdAsync(carpetaId, usuarioId);
        }

        public async Task<bool> DeleteCarpetaAsync(int carpetaId, int usuarioId)
        {
            return await _carpetaRepository.EnviarAPapeleraAsync(carpetaId, usuarioId);
        }

        public async Task<bool> RestaurarCarpetaAsync(int carpetaId, int usuarioId)
        {
            return await _carpetaRepository.RestaurarCarpetaAsync(carpetaId, usuarioId);
        }

        public async Task<bool> ReordenarCarpetasAsync(List<ReordenarCarpetaDto> carpetas, int usuarioId)
        {
            return await _carpetaRepository.ReordenarAsync(carpetas, usuarioId);
        }
    }
} 