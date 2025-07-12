using AplicacionNotas.Models.DTOs.Tareas;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using AutoMapper;

namespace AplicacionNotas.Services.Implementations
{
    public class TareaService : ITareaService
    {
        private readonly ITareaRepository _tareaRepository;
        private readonly IMapper _mapper;

        public TareaService(ITareaRepository tareaRepository, IMapper mapper)
        {
            _tareaRepository = tareaRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TareaDto>> GetTareasPendientesAsync(int usuarioId)
        {
            return await _tareaRepository.GetTareasPendientesAsync(usuarioId);
        }

        public async Task<IEnumerable<TareaDto>> GetTareasCompletadasAsync(int usuarioId)
        {
            return await _tareaRepository.GetTareasCompletadasAsync(usuarioId);
        }

        public async Task<TareaDto?> GetTareaByIdAsync(int tareaId, int usuarioId)
        {
            return await _tareaRepository.GetByIdAsync(tareaId, usuarioId);
        }

        public async Task<TareaDto> CreateTareaAsync(CrearTareaDto request, int usuarioId)
        {
            var tarea = new Tarea
            {
                TarUsuarioId = usuarioId,
                TarTitulo = request.Titulo,
                TarDescripcion = request.Descripcion,
                TarPrioridad = request.Prioridad,
                TarFechaVencimiento = request.FechaVencimiento,
                TarEstado = request.Estado, // Agregar el campo Estado
                TarCompletada = false,
                TarEliminado = false,
                TarFechaCreacion = DateTime.UtcNow,
                TarFechaActualizacion = DateTime.UtcNow
            };

            var tareaId = await _tareaRepository.CreateAsync(tarea, usuarioId);

            var tareaCreada = await _tareaRepository.GetByIdAsync(tareaId, usuarioId);
            return tareaCreada ?? throw new InvalidOperationException("Error al crear la tarea");
        }

        public async Task<TareaDto?> UpdateTareaAsync(int tareaId, ActualizarTareaDto request, int usuarioId)
        {
            var tareaExistente = await _tareaRepository.GetByIdAsync(tareaId, usuarioId);
            if (tareaExistente is null)
            {
                return null;
            }

            var tarea = new Tarea
            {
                TarId = tareaId,
                TarUsuarioId = usuarioId,
                TarTitulo = request.Titulo,
                TarDescripcion = request.Descripcion,
                TarPrioridad = request.Prioridad,
                TarFechaVencimiento = request.FechaVencimiento,
                TarEstado = request.Estado // Agregar el campo Estado
            };

            var actualizada = await _tareaRepository.UpdateAsync(tarea, usuarioId);
            if (!actualizada)
            {
                return null;
            }

            return await _tareaRepository.GetByIdAsync(tareaId, usuarioId);
        }

        public async Task<bool> DeleteTareaAsync(int tareaId, int usuarioId)
        {
            return await _tareaRepository.EnviarAPapeleraAsync(tareaId, usuarioId);
        }

        public async Task<bool> RestaurarTareaAsync(int tareaId, int usuarioId)
        {
            return await _tareaRepository.RestaurarTareaAsync(tareaId, usuarioId);
        }

        public async Task<bool> ToggleCompletadaAsync(int tareaId, int usuarioId)
        {
            var tarea = await _tareaRepository.GetByIdAsync(tareaId, usuarioId);
            if (tarea == null)
                return false;

            // Si la tarea se está completando, cambiar el estado a "completada"
            if (!tarea.Completada)
            {
                await _tareaRepository.CambiarEstadoAsync(tareaId, "completada", usuarioId);
            }

            return await _tareaRepository.ToggleCompletadaAsync(tareaId, usuarioId);
        }

        public async Task<IEnumerable<TareaDto>> GetTareasVencidasAsync(int usuarioId)
        {
            var tareasPendientes = await _tareaRepository.GetTareasPendientesAsync(usuarioId);
            return tareasPendientes.Where(t => t.Estado == "Vencida");
        }

        public async Task<IEnumerable<TareaDto>> GetTareasUrgentesAsync(int usuarioId)
        {
            var tareasPendientes = await _tareaRepository.GetTareasPendientesAsync(usuarioId);
            return tareasPendientes.Where(t => t.Estado == "Urgente" || t.Estado == "Próxima");
        }

        // Nuevos métodos para el flujo Kanban
        public async Task<IEnumerable<TareaDto>> GetTareasPorEstadoAsync(int usuarioId, string estado)
        {
            return await _tareaRepository.GetTareasPorEstadoAsync(usuarioId, estado);
        }

        public async Task<bool> CambiarEstadoTareaAsync(int tareaId, string nuevoEstado, int usuarioId)
        {
            return await _tareaRepository.CambiarEstadoAsync(tareaId, nuevoEstado, usuarioId);
        }

        public async Task<IEnumerable<TareaDto>> GetTareasKanbanAsync(int usuarioId)
        {
            return await _tareaRepository.GetTareasKanbanAsync(usuarioId);
        }
    }
}
