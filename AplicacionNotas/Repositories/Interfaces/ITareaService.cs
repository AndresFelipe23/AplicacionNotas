using AplicacionNotas.Models.DTOs.Tareas;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface ITareaService
    {
        Task<IEnumerable<TareaDto>> GetTareasPendientesAsync(int usuarioId);
        Task<IEnumerable<TareaDto>> GetTareasCompletadasAsync(int usuarioId);
        Task<TareaDto?> GetTareaByIdAsync(int tareaId, int usuarioId);
        Task<TareaDto> CreateTareaAsync(CrearTareaDto request, int usuarioId);
        Task<TareaDto?> UpdateTareaAsync(int tareaId, ActualizarTareaDto request, int usuarioId);
        Task<bool> DeleteTareaAsync(int tareaId, int usuarioId);
        Task<bool> RestaurarTareaAsync(int tareaId, int usuarioId);
        Task<bool> ToggleCompletadaAsync(int tareaId, int usuarioId);
        Task<IEnumerable<TareaDto>> GetTareasVencidasAsync(int usuarioId);
        Task<IEnumerable<TareaDto>> GetTareasUrgentesAsync(int usuarioId);
        
        // Nuevos métodos para el flujo Kanban
        Task<IEnumerable<TareaDto>> GetTareasPorEstadoAsync(int usuarioId, string estado);
        Task<bool> CambiarEstadoTareaAsync(int tareaId, string nuevoEstado, int usuarioId);
        Task<IEnumerable<TareaDto>> GetTareasKanbanAsync(int usuarioId);
    }
}
