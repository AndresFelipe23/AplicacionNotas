using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AplicacionNotas.Models.DTOs.Carpetas;
using AplicacionNotas.Services.Implementations;
using AplicacionNotas.Extensions;

namespace AplicacionNotas.Controllers
{
    /// <summary>
    /// Controlador para operaciones de carpetas
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    public class CarpetasController : ControllerBase
    {
        private readonly ICarpetaService _carpetaService;
        private readonly ILogger<CarpetasController> _logger;

        public CarpetasController(ICarpetaService carpetaService, ILogger<CarpetasController> logger)
        {
            _carpetaService = carpetaService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene todas las carpetas del usuario autenticado
        /// </summary>
        /// <returns>Lista de carpetas del usuario</returns>
        /// <response code="200">Lista de carpetas obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CarpetaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetCarpetas()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo carpetas para el usuario: {UsuarioId}", usuarioId);

                var carpetas = await _carpetaService.GetCarpetasAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Carpetas obtenidas exitosamente",
                    data = carpetas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener carpetas para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene una carpeta específica por ID
        /// </summary>
        /// <param name="id">ID de la carpeta</param>
        /// <returns>Carpeta solicitada</returns>
        /// <response code="200">Carpeta obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Carpeta no encontrada</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CarpetaDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> GetCarpeta(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo carpeta {CarpetaId} para el usuario: {UsuarioId}", id, usuarioId);

                var carpeta = await _carpetaService.GetCarpetaByIdAsync(id, usuarioId);
                
                if (carpeta == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Carpeta no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Carpeta obtenida exitosamente",
                    data = carpeta
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener carpeta {CarpetaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Crea una nueva carpeta
        /// </summary>
        /// <param name="request">Datos de la carpeta a crear</param>
        /// <returns>Carpeta creada</returns>
        /// <response code="201">Carpeta creada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpPost]
        [ProducesResponseType(typeof(CarpetaDto), 201)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> CreateCarpeta([FromBody] CrearCarpetaDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Creando carpeta '{Nombre}' para el usuario: {UsuarioId}", request.Nombre, usuarioId);

                var carpeta = await _carpetaService.CreateCarpetaAsync(request, usuarioId);

                return CreatedAtAction(nameof(GetCarpeta), new { id = carpeta.Id }, new
                {
                    success = true,
                    message = "Carpeta creada exitosamente",
                    data = carpeta
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear carpeta '{Nombre}' para el usuario: {UsuarioId}", request.Nombre, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Actualiza una carpeta existente
        /// </summary>
        /// <param name="id">ID de la carpeta</param>
        /// <param name="request">Datos actualizados de la carpeta</param>
        /// <returns>Carpeta actualizada</returns>
        /// <response code="200">Carpeta actualizada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Carpeta no encontrada</response>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(CarpetaDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> UpdateCarpeta(int id, [FromBody] CrearCarpetaDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Actualizando carpeta {CarpetaId} para el usuario: {UsuarioId}", id, usuarioId);

                var carpeta = await _carpetaService.UpdateCarpetaAsync(id, request, usuarioId);
                
                if (carpeta == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Carpeta no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Carpeta actualizada exitosamente",
                    data = carpeta
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar carpeta {CarpetaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Elimina una carpeta (envía a papelera)
        /// </summary>
        /// <param name="id">ID de la carpeta</param>
        /// <returns>Resultado de la eliminación</returns>
        /// <response code="200">Carpeta eliminada exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Carpeta no encontrada</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> DeleteCarpeta(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Eliminando carpeta {CarpetaId} para el usuario: {UsuarioId}", id, usuarioId);

                var eliminado = await _carpetaService.DeleteCarpetaAsync(id, usuarioId);
                
                if (!eliminado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Carpeta no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Carpeta eliminada exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar carpeta {CarpetaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Restaura una carpeta desde la papelera
        /// </summary>
        /// <param name="id">ID de la carpeta</param>
        /// <returns>Resultado de la restauración</returns>
        /// <response code="200">Carpeta restaurada exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Carpeta no encontrada</response>
        [HttpPost("{id}/restaurar")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> RestaurarCarpeta(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Restaurando carpeta {CarpetaId} para el usuario: {UsuarioId}", id, usuarioId);

                var restaurado = await _carpetaService.RestaurarCarpetaAsync(id, usuarioId);
                
                if (!restaurado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Carpeta no encontrada en la papelera"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Carpeta restaurada exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al restaurar carpeta {CarpetaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Reordena las carpetas del usuario
        /// </summary>
        /// <param name="request">Lista de carpetas con nuevo orden</param>
        /// <returns>Resultado del reordenamiento</returns>
        /// <response code="200">Carpetas reordenadas exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpPost("reordenar")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> ReordenarCarpetas([FromBody] List<ReordenarCarpetaDto> request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Reordenando {Cantidad} carpetas para el usuario: {UsuarioId}", request.Count, usuarioId);

                var reordenado = await _carpetaService.ReordenarCarpetasAsync(request, usuarioId);
                
                if (!reordenado)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Error al reordenar las carpetas"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Carpetas reordenadas exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al reordenar carpetas para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene los colores disponibles para carpetas
        /// </summary>
        /// <returns>Lista de colores disponibles</returns>
        /// <response code="200">Colores obtenidos exitosamente</response>
        [HttpGet("colores")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult GetColores()
        {
            var colores = new[]
            {
                new { valor = "#3B82F6", nombre = "Azul" },
                new { valor = "#EF4444", nombre = "Rojo" },
                new { valor = "#10B981", nombre = "Verde" },
                new { valor = "#F59E0B", nombre = "Amarillo" },
                new { valor = "#8B5CF6", nombre = "Púrpura" },
                new { valor = "#EC4899", nombre = "Rosa" },
                new { valor = "#06B6D4", nombre = "Cian" },
                new { valor = "#84CC16", nombre = "Lima" },
                new { valor = "#F97316", nombre = "Naranja" },
                new { valor = "#6B7280", nombre = "Gris" }
            };

            return Ok(new
            {
                success = true,
                message = "Colores obtenidos exitosamente",
                data = colores
            });
        }

        /// <summary>
        /// Obtiene los iconos disponibles para carpetas
        /// </summary>
        /// <returns>Lista de iconos disponibles</returns>
        /// <response code="200">Iconos obtenidos exitosamente</response>
        [HttpGet("iconos")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult GetIconos()
        {
            var iconos = new[]
            {
                new { valor = "carpeta", nombre = "Carpeta" },
                new { valor = "estrella", nombre = "Estrella" },
                new { valor = "corazon", nombre = "Corazón" },
                new { valor = "fuego", nombre = "Fuego" },
                new { valor = "diamante", nombre = "Diamante" },
                new { valor = "musica", nombre = "Música" },
                new { valor = "deporte", nombre = "Deporte" },
                new { valor = "trabajo", nombre = "Trabajo" },
                new { valor = "casa", nombre = "Casa" },
                new { valor = "escuela", nombre = "Escuela" }
            };

            return Ok(new
            {
                success = true,
                message = "Iconos obtenidos exitosamente",
                data = iconos
            });
        }
    }
} 