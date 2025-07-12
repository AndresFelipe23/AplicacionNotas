using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AplicacionNotas.Models.DTOs.Tareas;
using AplicacionNotas.Repositories.Interfaces;
using AplicacionNotas.Extensions;

namespace AplicacionNotas.Controllers
{
    /// <summary>
    /// Controlador para operaciones de tareas
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    public class TareasController : ControllerBase
    {
        private readonly ITareaService _tareaService;
        private readonly ILogger<TareasController> _logger;

        public TareasController(ITareaService tareaService, ILogger<TareasController> logger)
        {
            _tareaService = tareaService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene todas las tareas pendientes del usuario autenticado
        /// </summary>
        /// <returns>Lista de tareas pendientes</returns>
        /// <response code="200">Lista de tareas obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TareaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetTareasPendientes()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo tareas pendientes para el usuario: {UsuarioId}", usuarioId);

                var tareas = await _tareaService.GetTareasPendientesAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Tareas pendientes obtenidas exitosamente",
                    data = tareas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tareas pendientes para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene todas las tareas completadas del usuario autenticado
        /// </summary>
        /// <returns>Lista de tareas completadas</returns>
        /// <response code="200">Lista de tareas completadas obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("completadas")]
        [ProducesResponseType(typeof(IEnumerable<TareaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetTareasCompletadas()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo tareas completadas para el usuario: {UsuarioId}", usuarioId);

                var tareas = await _tareaService.GetTareasCompletadasAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Tareas completadas obtenidas exitosamente",
                    data = tareas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tareas completadas para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene las tareas vencidas del usuario autenticado
        /// </summary>
        /// <returns>Lista de tareas vencidas</returns>
        /// <response code="200">Lista de tareas vencidas obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("vencidas")]
        [ProducesResponseType(typeof(IEnumerable<TareaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetTareasVencidas()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo tareas vencidas para el usuario: {UsuarioId}", usuarioId);

                var tareas = await _tareaService.GetTareasVencidasAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Tareas vencidas obtenidas exitosamente",
                    data = tareas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tareas vencidas para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene las tareas urgentes del usuario autenticado
        /// </summary>
        /// <returns>Lista de tareas urgentes</returns>
        /// <response code="200">Lista de tareas urgentes obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("urgentes")]
        [ProducesResponseType(typeof(IEnumerable<TareaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetTareasUrgentes()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo tareas urgentes para el usuario: {UsuarioId}", usuarioId);

                var tareas = await _tareaService.GetTareasUrgentesAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Tareas urgentes obtenidas exitosamente",
                    data = tareas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tareas urgentes para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene una tarea específica por ID
        /// </summary>
        /// <param name="id">ID de la tarea</param>
        /// <returns>Tarea solicitada</returns>
        /// <response code="200">Tarea obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Tarea no encontrada</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TareaDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> GetTarea(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo tarea {TareaId} para el usuario: {UsuarioId}", id, usuarioId);

                var tarea = await _tareaService.GetTareaByIdAsync(id, usuarioId);
                
                if (tarea == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Tarea no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Tarea obtenida exitosamente",
                    data = tarea
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tarea {TareaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Crea una nueva tarea
        /// </summary>
        /// <param name="request">Datos de la tarea a crear</param>
        /// <returns>Tarea creada</returns>
        /// <response code="201">Tarea creada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpPost]
        [ProducesResponseType(typeof(TareaDto), 201)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> CreateTarea([FromBody] CrearTareaDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Creando tarea '{Titulo}' para el usuario: {UsuarioId}", request.Titulo, usuarioId);

                var tarea = await _tareaService.CreateTareaAsync(request, usuarioId);

                return CreatedAtAction(nameof(GetTarea), new { id = tarea.Id }, new
                {
                    success = true,
                    message = "Tarea creada exitosamente",
                    data = tarea
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear tarea '{Titulo}' para el usuario: {UsuarioId}", request.Titulo, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Actualiza una tarea existente
        /// </summary>
        /// <param name="id">ID de la tarea</param>
        /// <param name="request">Datos actualizados de la tarea</param>
        /// <returns>Tarea actualizada</returns>
        /// <response code="200">Tarea actualizada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Tarea no encontrada</response>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(TareaDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> UpdateTarea(int id, [FromBody] ActualizarTareaDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Actualizando tarea {TareaId} para el usuario: {UsuarioId}", id, usuarioId);

                var tarea = await _tareaService.UpdateTareaAsync(id, request, usuarioId);
                
                if (tarea == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Tarea no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Tarea actualizada exitosamente",
                    data = tarea
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar tarea {TareaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Elimina una tarea (envía a papelera)
        /// </summary>
        /// <param name="id">ID de la tarea</param>
        /// <returns>Resultado de la eliminación</returns>
        /// <response code="200">Tarea eliminada exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Tarea no encontrada</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> DeleteTarea(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Eliminando tarea {TareaId} para el usuario: {UsuarioId}", id, usuarioId);

                var eliminado = await _tareaService.DeleteTareaAsync(id, usuarioId);
                
                if (!eliminado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Tarea no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Tarea eliminada exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar tarea {TareaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Restaura una tarea desde la papelera
        /// </summary>
        /// <param name="id">ID de la tarea</param>
        /// <returns>Resultado de la restauración</returns>
        /// <response code="200">Tarea restaurada exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Tarea no encontrada</response>
        [HttpPost("{id}/restaurar")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> RestaurarTarea(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Restaurando tarea {TareaId} para el usuario: {UsuarioId}", id, usuarioId);

                var restaurado = await _tareaService.RestaurarTareaAsync(id, usuarioId);
                
                if (!restaurado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Tarea no encontrada en la papelera"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Tarea restaurada exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al restaurar tarea {TareaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Cambia el estado de completada de una tarea
        /// </summary>
        /// <param name="id">ID de la tarea</param>
        /// <returns>Resultado del cambio</returns>
        /// <response code="200">Estado de completada cambiado exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Tarea no encontrada</response>
        [HttpPost("{id}/completar")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> ToggleCompletada(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Cambiando estado de completada para tarea {TareaId} del usuario: {UsuarioId}", id, usuarioId);

                var cambiado = await _tareaService.ToggleCompletadaAsync(id, usuarioId);
                
                if (!cambiado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Tarea no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Estado de completada cambiado exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cambiar estado de completada para tarea {TareaId} del usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene las prioridades disponibles para las tareas
        /// </summary>
        /// <returns>Lista de prioridades disponibles</returns>
        /// <response code="200">Prioridades obtenidas exitosamente</response>
        [HttpGet("prioridades")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult GetPrioridades()
        {
            var prioridades = new[]
            {
                new { valor = 1, nombre = "Baja", color = "#10B981", emoji = "🟢" },
                new { valor = 2, nombre = "Media", color = "#F59E0B", emoji = "🟡" },
                new { valor = 3, nombre = "Alta", color = "#F97316", emoji = "🟠" },
                new { valor = 4, nombre = "Urgente", color = "#EF4444", emoji = "🔴" }
            };

            return Ok(new
            {
                success = true,
                message = "Prioridades obtenidas exitosamente",
                data = prioridades
            });
        }

        /// <summary>
        /// Obtiene estadísticas de tareas del usuario
        /// </summary>
        /// <returns>Estadísticas de tareas</returns>
        /// <response code="200">Estadísticas obtenidas exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("estadisticas")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetEstadisticas()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo estadísticas de tareas para el usuario: {UsuarioId}", usuarioId);

                var tareasPendientes = await _tareaService.GetTareasPendientesAsync(usuarioId);
                var tareasCompletadas = await _tareaService.GetTareasCompletadasAsync(usuarioId);
                var tareasVencidas = await _tareaService.GetTareasVencidasAsync(usuarioId);
                var tareasUrgentes = await _tareaService.GetTareasUrgentesAsync(usuarioId);

                var totalTareas = tareasPendientes.Count() + tareasCompletadas.Count();
                var porcentajeCompletadas = totalTareas > 0 ? (double)tareasCompletadas.Count() / totalTareas * 100 : 0;

                var estadisticas = new
                {
                    total = totalTareas,
                    pendientes = tareasPendientes.Count(),
                    completadas = tareasCompletadas.Count(),
                    vencidas = tareasVencidas.Count(),
                    urgentes = tareasUrgentes.Count(),
                    porcentajeCompletadas = Math.Round(porcentajeCompletadas, 1),
                    porPrioridad = new
                    {
                        baja = tareasPendientes.Count(t => t.Prioridad == 1),
                        media = tareasPendientes.Count(t => t.Prioridad == 2),
                        alta = tareasPendientes.Count(t => t.Prioridad == 3),
                        urgente = tareasPendientes.Count(t => t.Prioridad == 4)
                    }
                };

                return Ok(new
                {
                    success = true,
                    message = "Estadísticas obtenidas exitosamente",
                    data = estadisticas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener estadísticas para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene tareas por estado específico (para flujo Kanban)
        /// </summary>
        /// <param name="estado">Estado de las tareas a obtener</param>
        /// <returns>Lista de tareas del estado especificado</returns>
        /// <response code="200">Tareas obtenidas exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("estado/{estado}")]
        [ProducesResponseType(typeof(IEnumerable<TareaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetTareasPorEstado(string estado)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo tareas con estado '{Estado}' para el usuario: {UsuarioId}", estado, usuarioId);

                var tareas = await _tareaService.GetTareasPorEstadoAsync(usuarioId, estado);

                return Ok(new
                {
                    success = true,
                    message = $"Tareas con estado '{estado}' obtenidas exitosamente",
                    data = tareas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tareas con estado '{Estado}' para el usuario: {UsuarioId}", estado, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Cambia el estado de una tarea (para drag & drop en Kanban)
        /// </summary>
        /// <param name="id">ID de la tarea</param>
        /// <param name="nuevoEstado">Nuevo estado de la tarea</param>
        /// <returns>Resultado del cambio de estado</returns>
        /// <response code="200">Estado cambiado exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Tarea no encontrada</response>
        [HttpPost("{id}/estado")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> CambiarEstadoTarea(int id, [FromBody] string nuevoEstado)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Cambiando estado de tarea {TareaId} a '{NuevoEstado}' para el usuario: {UsuarioId}", id, nuevoEstado, usuarioId);

                var cambiado = await _tareaService.CambiarEstadoTareaAsync(id, nuevoEstado, usuarioId);
                
                if (!cambiado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Tarea no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = $"Estado de la tarea cambiado a '{nuevoEstado}' exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cambiar estado de tarea {TareaId} a '{NuevoEstado}' para el usuario: {UsuarioId}", id, nuevoEstado, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene todas las tareas organizadas por columnas del Kanban
        /// </summary>
        /// <returns>Todas las tareas organizadas por estado</returns>
        /// <response code="200">Tareas del Kanban obtenidas exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("kanban")]
        [ProducesResponseType(typeof(IEnumerable<TareaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetTareasKanban()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo tareas del Kanban para el usuario: {UsuarioId}", usuarioId);

                var tareas = await _tareaService.GetTareasKanbanAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Tareas del Kanban obtenidas exitosamente",
                    data = tareas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tareas del Kanban para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }
    }
} 