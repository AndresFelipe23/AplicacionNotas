using AplicacionNotas.Models.DTOs.Tareas;
using AplicacionNotas.Models.Entities;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface ITareaRepository
    {
        Task<IEnumerable<TareaDto>> GetTareasPendientesAsync(int usuarioId);
        Task<IEnumerable<TareaDto>> GetTareasCompletadasAsync(int usuarioId);
        Task<TareaDto?> GetByIdAsync(int tareaId, int usuarioId);
        Task<int> CreateAsync(Tarea tarea, int usuarioId);
        Task<bool> UpdateAsync(Tarea tarea, int usuarioId);
        Task<bool> ToggleCompletadaAsync(int tareaId, int usuarioId);
        Task<bool> EnviarAPapeleraAsync(int tareaId, int usuarioId);
        Task<bool> RestaurarTareaAsync(int tareaId, int usuarioId);
        Task<bool> RestaurarAsync(int tareaId, int usuarioId);
        Task<bool> EliminarPermanenteAsync(int tareaId, int usuarioId);
        
        // Nuevos métodos para el flujo Kanban
        Task<IEnumerable<TareaDto>> GetTareasPorEstadoAsync(int usuarioId, string estado);
        Task<bool> CambiarEstadoAsync(int tareaId, string nuevoEstado, int usuarioId);
        Task<IEnumerable<TareaDto>> GetTareasKanbanAsync(int usuarioId);
    }
}
