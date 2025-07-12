using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AplicacionNotas.Models.DTOs.Notas;
using AplicacionNotas.Repositories.Interfaces;
using AplicacionNotas.Extensions;

namespace AplicacionNotas.Controllers
{
    /// <summary>
    /// Controlador para operaciones de notas
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    public class NotasController : ControllerBase
    {
        private readonly INotaService _notaService;
        private readonly ILogger<NotasController> _logger;

        public NotasController(INotaService notaService, ILogger<NotasController> logger)
        {
            _notaService = notaService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene todas las notas del usuario autenticado
        /// </summary>
        /// <returns>Lista de notas del usuario</returns>
        /// <response code="200">Lista de notas obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<NotaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetNotas()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo notas para el usuario: {UsuarioId}", usuarioId);

                var notas = await _notaService.GetNotasAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Notas obtenidas exitosamente",
                    data = notas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener notas para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene una nota específica por ID
        /// </summary>
        /// <param name="id">ID de la nota</param>
        /// <returns>Nota solicitada</returns>
        /// <response code="200">Nota obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Nota no encontrada</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(NotaDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> GetNota(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo nota {NotaId} para el usuario: {UsuarioId}", id, usuarioId);

                var nota = await _notaService.GetNotaByIdAsync(id, usuarioId);
                
                if (nota == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Nota no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Nota obtenida exitosamente",
                    data = nota
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener nota {NotaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Crea una nueva nota
        /// </summary>
        /// <param name="request">Datos de la nota a crear</param>
        /// <returns>Nota creada</returns>
        /// <response code="201">Nota creada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpPost]
        [ProducesResponseType(typeof(NotaDto), 201)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> CreateNota([FromBody] CrearNotaDto request)
        {
            try
            {
                // Validar el modelo
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    
                    return BadRequest(new
                    {
                        success = false,
                        message = "Datos inválidos",
                        errors = errors
                    });
                }

                var usuarioId = User.GetUserId();
                _logger.LogInformation("Creando nota '{Titulo}' para el usuario: {UsuarioId}", request.Titulo, usuarioId);

                var nota = await _notaService.CreateNotaAsync(request, usuarioId);

                return CreatedAtAction(nameof(GetNota), new { id = nota.Id }, new
                {
                    success = true,
                    message = "Nota creada exitosamente",
                    data = nota
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Error de validación al crear nota para el usuario: {UsuarioId}", User.GetUserId());
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear nota '{Titulo}' para el usuario: {UsuarioId}", request.Titulo, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Actualiza una nota existente
        /// </summary>
        /// <param name="id">ID de la nota</param>
        /// <param name="request">Datos actualizados de la nota</param>
        /// <returns>Nota actualizada</returns>
        /// <response code="200">Nota actualizada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Nota no encontrada</response>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(NotaDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> UpdateNota(int id, [FromBody] ActualizarNotaDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Actualizando nota {NotaId} para el usuario: {UsuarioId}", id, usuarioId);
                _logger.LogInformation("Datos de actualización: Titulo={Titulo}, Etiquetas={Etiquetas}, Favorito={Favorito}", 
                    request.Titulo, 
                    request.Etiquetas != null ? string.Join(",", request.Etiquetas) : "null", 
                    request.Favorito);

                var nota = await _notaService.UpdateNotaAsync(id, request, usuarioId);
                
                if (nota == null)
                {
                    _logger.LogWarning("Nota {NotaId} no encontrada para el usuario: {UsuarioId}", id, usuarioId);
                    return NotFound(new
                    {
                        success = false,
                        message = "Nota no encontrada"
                    });
                }

                _logger.LogInformation("Nota {NotaId} actualizada exitosamente para el usuario: {UsuarioId}", id, usuarioId);
                return Ok(new
                {
                    success = true,
                    message = "Nota actualizada exitosamente",
                    data = nota
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar nota {NotaId} para el usuario: {UsuarioId}. Error: {Error}", 
                    id, User.GetUserId(), ex.Message);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Elimina una nota (envía a papelera)
        /// </summary>
        /// <param name="id">ID de la nota</param>
        /// <returns>Resultado de la eliminación</returns>
        /// <response code="200">Nota eliminada exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Nota no encontrada</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> DeleteNota(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Eliminando nota {NotaId} para el usuario: {UsuarioId}", id, usuarioId);

                var eliminado = await _notaService.DeleteNotaAsync(id, usuarioId);
                
                if (!eliminado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Nota no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Nota eliminada exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar nota {NotaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Restaura una nota desde la papelera
        /// </summary>
        /// <param name="id">ID de la nota</param>
        /// <returns>Resultado de la restauración</returns>
        /// <response code="200">Nota restaurada exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Nota no encontrada</response>
        [HttpPost("{id}/restaurar")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> RestaurarNota(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Restaurando nota {NotaId} para el usuario: {UsuarioId}", id, usuarioId);

                var restaurado = await _notaService.RestaurarNotaAsync(id, usuarioId);
                
                if (!restaurado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Nota no encontrada en la papelera"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Nota restaurada exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al restaurar nota {NotaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene las notas favoritas del usuario
        /// </summary>
        /// <returns>Lista de notas favoritas</returns>
        /// <response code="200">Notas favoritas obtenidas exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("favoritas")]
        [ProducesResponseType(typeof(IEnumerable<NotaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetNotasFavoritas()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo notas favoritas para el usuario: {UsuarioId}", usuarioId);

                var notas = await _notaService.GetNotasFavoritasAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Notas favoritas obtenidas exitosamente",
                    data = notas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener notas favoritas para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene las notas archivadas del usuario
        /// </summary>
        /// <returns>Lista de notas archivadas</returns>
        /// <response code="200">Notas archivadas obtenidas exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("archivadas")]
        [ProducesResponseType(typeof(IEnumerable<NotaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetNotasArchivadas()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo notas archivadas para el usuario: {UsuarioId}", usuarioId);

                var notas = await _notaService.GetNotasArchivadasAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Notas archivadas obtenidas exitosamente",
                    data = notas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener notas archivadas para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Cambia el estado de favorito de una nota
        /// </summary>
        /// <param name="id">ID de la nota</param>
        /// <returns>Resultado del cambio</returns>
        /// <response code="200">Estado de favorito cambiado exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Nota no encontrada</response>
        [HttpPost("{id}/favorito")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> ToggleFavorito(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Cambiando estado de favorito para nota {NotaId} del usuario: {UsuarioId}", id, usuarioId);

                var cambiado = await _notaService.ToggleFavoritoAsync(id, usuarioId);
                
                if (!cambiado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Nota no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Estado de favorito cambiado exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cambiar estado de favorito para nota {NotaId} del usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Cambia el estado de archivado de una nota
        /// </summary>
        /// <param name="id">ID de la nota</param>
        /// <returns>Resultado del cambio</returns>
        /// <response code="200">Estado de archivado cambiado exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Nota no encontrada</response>
        [HttpPost("{id}/archivar")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> ToggleArchivado(int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Cambiando estado de archivado para nota {NotaId} del usuario: {UsuarioId}", id, usuarioId);

                var cambiado = await _notaService.ToggleArchivadoAsync(id, usuarioId);
                
                if (!cambiado)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Nota no encontrada"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Estado de archivado cambiado exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cambiar estado de archivado para nota {NotaId} del usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Busca notas por término de búsqueda
        /// </summary>
        /// <param name="termino">Término de búsqueda</param>
        /// <returns>Notas que coinciden con la búsqueda</returns>
        /// <response code="200">Búsqueda realizada exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("buscar")]
        [ProducesResponseType(typeof(IEnumerable<NotaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> BuscarNotas([FromQuery] string termino)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Buscando notas con término '{Termino}' para el usuario: {UsuarioId}", termino, usuarioId);

                var notas = await _notaService.SearchNotasAsync(termino, usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Búsqueda realizada exitosamente",
                    data = notas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al buscar notas con término '{Termino}' para el usuario: {UsuarioId}", termino, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Mueve una nota a otra carpeta
        /// </summary>
        /// <param name="id">ID de la nota</param>
        /// <param name="request">Datos del movimiento</param>
        /// <returns>Resultado del movimiento</returns>
        /// <response code="200">Nota movida exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Nota no encontrada</response>
        [HttpPost("{id}/mover")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> MoverNota(int id, [FromBody] MoverNotaDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Moviendo nota {NotaId} a carpeta {CarpetaId} para el usuario: {UsuarioId}", 
                    id, request.NuevaCarpetaId, usuarioId);

                // Por ahora, actualizamos la nota con la nueva carpeta
                var notaExistente = await _notaService.GetNotaByIdAsync(id, usuarioId);
                if (notaExistente == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Nota no encontrada"
                    });
                }

                var actualizarRequest = new ActualizarNotaDto
                {
                    CarpetaId = request.NuevaCarpetaId,
                    Titulo = notaExistente.Titulo,
                    Contenido = notaExistente.Contenido,
                    Favorito = notaExistente.Favorito,
                    Etiquetas = notaExistente.Etiquetas,
                    Archivado = notaExistente.Archivado
                };

                var notaActualizada = await _notaService.UpdateNotaAsync(id, actualizarRequest, usuarioId);
                
                if (notaActualizada == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Error al mover la nota"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Nota movida exitosamente",
                    data = notaActualizada
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al mover nota {NotaId} para el usuario: {UsuarioId}", id, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Busca notas con filtros avanzados
        /// </summary>
        /// <param name="filtros">Filtros de búsqueda</param>
        /// <returns>Notas que coinciden con los filtros</returns>
        /// <response code="200">Búsqueda avanzada realizada exitosamente</response>
        /// <response code="400">Filtros inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpPost("buscar-avanzada")]
        [ProducesResponseType(typeof(IEnumerable<NotaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> BuscarNotasAvanzada([FromBody] BuscarNotasDto filtros)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Búsqueda avanzada de notas para el usuario: {UsuarioId}", usuarioId);

                // Por ahora, usamos la búsqueda simple. En el futuro se puede implementar búsqueda avanzada
                var notas = await _notaService.SearchNotasAsync(filtros.Termino ?? "", usuarioId);

                // Aplicar filtros adicionales
                if (filtros.SoloFavoritas == true)
                {
                    notas = notas.Where(n => n.Favorito);
                }

                if (filtros.SoloArchivadas == true)
                {
                    notas = notas.Where(n => n.Archivado);
                }

                if (filtros.CarpetaId.HasValue)
                {
                    notas = notas.Where(n => n.CarpetaId == filtros.CarpetaId);
                }

                if (filtros.Etiquetas != null && filtros.Etiquetas.Any())
                {
                    notas = notas.Where(n => n.Etiquetas != null && 
                                           filtros.Etiquetas.Any(e => n.Etiquetas.Contains(e)));
                }

                if (filtros.FechaDesde.HasValue)
                {
                    notas = notas.Where(n => n.FechaCreacion >= filtros.FechaDesde.Value);
                }

                if (filtros.FechaHasta.HasValue)
                {
                    notas = notas.Where(n => n.FechaCreacion <= filtros.FechaHasta.Value);
                }

                // Ordenar
                notas = filtros.OrdenarPor switch
                {
                    OrdenarPor.FechaCreacion => filtros.Ascendente ? 
                        notas.OrderBy(n => n.FechaCreacion) : notas.OrderByDescending(n => n.FechaCreacion),
                    OrdenarPor.FechaActualizacion => filtros.Ascendente ? 
                        notas.OrderBy(n => n.FechaActualizacion) : notas.OrderByDescending(n => n.FechaActualizacion),
                    OrdenarPor.Titulo => filtros.Ascendente ? 
                        notas.OrderBy(n => n.Titulo) : notas.OrderByDescending(n => n.Titulo),
                    OrdenarPor.CantidadPalabras => filtros.Ascendente ? 
                        notas.OrderBy(n => n.CantidadPalabras) : notas.OrderByDescending(n => n.CantidadPalabras),
                    _ => notas.OrderByDescending(n => n.FechaCreacion)
                };

                // Paginación
                var totalNotas = notas.Count();
                var notasPaginadas = notas
                    .Skip((filtros.Pagina - 1) * filtros.TamanoPagina)
                    .Take(filtros.TamanoPagina)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    message = "Búsqueda avanzada realizada exitosamente",
                    data = new
                    {
                        notas = notasPaginadas,
                        total = totalNotas,
                        pagina = filtros.Pagina,
                        tamanoPagina = filtros.TamanoPagina,
                        totalPaginas = (int)Math.Ceiling((double)totalNotas / filtros.TamanoPagina)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en búsqueda avanzada para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }
    }
} 