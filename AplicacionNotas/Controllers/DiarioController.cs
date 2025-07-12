using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AplicacionNotas.Models.DTOs.Diario;
using AplicacionNotas.Services.Implementations;
using AplicacionNotas.Extensions;

namespace AplicacionNotas.Controllers
{
    /// <summary>
    /// Controlador para operaciones del diario personal
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    public class DiarioController : ControllerBase
    {
        private readonly IDiarioService _diarioService;
        private readonly ILogger<DiarioController> _logger;

        public DiarioController(IDiarioService diarioService, ILogger<DiarioController> logger)
        {
            _diarioService = diarioService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene las entradas del diario para un mes y año específicos
        /// </summary>
        /// <param name="mes">Mes (1-12)</param>
        /// <param name="año">Año (ej: 2024)</param>
        /// <returns>Lista de entradas del diario</returns>
        /// <response code="200">Entradas obtenidas exitosamente</response>
        /// <response code="400">Parámetros inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<DiarioEntradaDto>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetEntradas([FromQuery] int mes, [FromQuery] int año)
        {
            try
            {
                if (mes < 1 || mes > 12)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "El mes debe estar entre 1 y 12"
                    });
                }

                if (año < 1900 || año > 2100)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "El año debe estar entre 1900 y 2100"
                    });
                }

                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo entradas del diario para mes {Mes}/{Año} del usuario: {UsuarioId}", mes, año, usuarioId);

                var entradas = await _diarioService.GetEntradasAsync(usuarioId, mes, año);

                return Ok(new
                {
                    success = true,
                    message = "Entradas del diario obtenidas exitosamente",
                    data = entradas
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener entradas del diario para mes {Mes}/{Año} del usuario: {UsuarioId}", mes, año, User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene una entrada específica del diario por fecha
        /// </summary>
        /// <param name="fecha">Fecha de la entrada (formato: yyyy-MM-dd)</param>
        /// <returns>Entrada del diario</returns>
        /// <response code="200">Entrada obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Entrada no encontrada</response>
        [HttpGet("{fecha:datetime}")]
        [ProducesResponseType(typeof(DiarioEntradaDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> GetEntrada(DateTime fecha)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo entrada del diario para fecha {Fecha} del usuario: {UsuarioId}", fecha.ToString("yyyy-MM-dd"), usuarioId);

                var entrada = await _diarioService.GetEntradaByDateAsync(fecha.Date, usuarioId);
                
                if (entrada == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Entrada no encontrada para esta fecha"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Entrada del diario obtenida exitosamente",
                    data = entrada
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener entrada del diario para fecha {Fecha} del usuario: {UsuarioId}", fecha.ToString("yyyy-MM-dd"), User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Crea una nueva entrada en el diario
        /// </summary>
        /// <param name="request">Datos de la entrada a crear</param>
        /// <returns>Entrada creada</returns>
        /// <response code="201">Entrada creada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="409">Ya existe una entrada para esta fecha</response>
        [HttpPost]
        [ProducesResponseType(typeof(DiarioEntradaDto), 201)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 409)]
        public async Task<IActionResult> CreateEntrada([FromBody] CrearEntradaDiarioDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Creando entrada del diario para fecha {Fecha} del usuario: {UsuarioId}", request.FechaEntrada.ToString("yyyy-MM-dd"), usuarioId);

                var entrada = await _diarioService.CreateEntradaAsync(request, usuarioId);
                
                if (entrada == null)
                {
                    return Conflict(new
                    {
                        success = false,
                        message = "Ya existe una entrada para esta fecha"
                    });
                }

                return CreatedAtAction(nameof(GetEntrada), new { fecha = request.FechaEntrada.ToString("yyyy-MM-dd") }, new
                {
                    success = true,
                    message = "Entrada del diario creada exitosamente",
                    data = entrada
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear entrada del diario para fecha {Fecha} del usuario: {UsuarioId}", request.FechaEntrada.ToString("yyyy-MM-dd"), User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Actualiza una entrada existente del diario
        /// </summary>
        /// <param name="fecha">Fecha de la entrada a actualizar</param>
        /// <param name="request">Datos actualizados de la entrada</param>
        /// <returns>Entrada actualizada</returns>
        /// <response code="200">Entrada actualizada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Entrada no encontrada</response>
        /// <response code="403">No se pudo actualizar la entrada</response>
        [HttpPut("{fecha:datetime}")]
        [ProducesResponseType(typeof(DiarioEntradaDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> UpdateEntrada(DateTime fecha, [FromBody] ActualizarEntradaDiarioDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Actualizando entrada del diario para fecha {Fecha} del usuario: {UsuarioId}", fecha.ToString("yyyy-MM-dd"), usuarioId);

                var entrada = await _diarioService.UpdateEntradaAsync(fecha.Date, request, usuarioId);
                
                if (entrada == null)
                {
                    // Verificar si la entrada existe
                    var entradaExistente = await _diarioService.GetEntradaByDateAsync(fecha.Date, usuarioId);
                    if (entradaExistente == null)
                    {
                        return NotFound(new
                        {
                            success = false,
                            message = "Entrada no encontrada para esta fecha"
                        });
                    }
                    else
                    {
                        return StatusCode(403, new
                        {
                            success = false,
                            message = "No se pudo actualizar la entrada"
                        });
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Entrada del diario actualizada exitosamente",
                    data = entrada
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar entrada del diario para fecha {Fecha} del usuario: {UsuarioId}", fecha.ToString("yyyy-MM-dd"), User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Elimina una entrada del diario (envía a papelera)
        /// </summary>
        /// <param name="fecha">Fecha de la entrada a eliminar</param>
        /// <returns>Resultado de la eliminación</returns>
        /// <response code="200">Entrada eliminada exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Entrada no encontrada</response>
        [HttpDelete("{fecha:datetime}")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> DeleteEntrada(DateTime fecha)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Eliminando entrada del diario para fecha {Fecha} del usuario: {UsuarioId}", fecha.ToString("yyyy-MM-dd"), usuarioId);

                var eliminada = await _diarioService.DeleteEntradaAsync(fecha.Date, usuarioId);
                
                if (!eliminada)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Entrada no encontrada para esta fecha"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Entrada del diario eliminada exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar entrada del diario para fecha {Fecha} del usuario: {UsuarioId}", fecha.ToString("yyyy-MM-dd"), User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Verifica el PIN de una entrada del diario
        /// </summary>
        /// <param name="request">Datos para verificar el PIN</param>
        /// <returns>Resultado de la verificación</returns>
        /// <response code="200">PIN verificado exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Entrada no encontrada</response>
        [HttpPost("verificar-pin")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> VerificarPin([FromBody] VerificarPinDiarioDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Verificando PIN de diario para el usuario: {UsuarioId}", usuarioId);

                var pinValido = await _diarioService.VerificarPinAsync(DateTime.Now, request.Pin, usuarioId);

                return Ok(new
                {
                    success = true,
                    message = pinValido ? "PIN correcto" : "PIN incorrecto",
                    data = new { pinValido }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al verificar PIN de diario para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene los estados de ánimo disponibles
        /// </summary>
        /// <returns>Lista de estados de ánimo</returns>
        /// <response code="200">Estados de ánimo obtenidos exitosamente</response>
        [HttpGet("estados-animo")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult GetEstadosAnimo()
        {
            var estadosAnimo = new[]
            {
                new { valor = 1, nombre = "Muy mal", emoji = "😢", color = "#EF4444" },
                new { valor = 2, nombre = "Mal", emoji = "😔", color = "#F97316" },
                new { valor = 3, nombre = "Regular", emoji = "😐", color = "#F59E0B" },
                new { valor = 4, nombre = "Bien", emoji = "😊", color = "#10B981" },
                new { valor = 5, nombre = "Excelente", emoji = "😁", color = "#22C55E" }
            };

            return Ok(new
            {
                success = true,
                message = "Estados de ánimo obtenidos exitosamente",
                data = estadosAnimo
            });
        }

        /// <summary>
        /// Busca entradas del diario según criterios específicos
        /// </summary>
        /// <param name="request">Criterios de búsqueda</param>
        /// <returns>Resultados de la búsqueda</returns>
        /// <response code="200">Búsqueda realizada exitosamente</response>
        /// <response code="400">Criterios de búsqueda inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpPost("buscar")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> BuscarEntradas([FromBody] BuscarEntradasDiarioDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Buscando entradas del diario con término '{Termino}' para el usuario: {UsuarioId}", request.Termino, usuarioId);

                // Por ahora, implementaremos una búsqueda básica
                // En el futuro, esto se puede mejorar con búsqueda full-text en la base de datos
                var entradas = await _diarioService.GetEntradasAsync(usuarioId, DateTime.Now.Month, DateTime.Now.Year);
                
                var resultados = entradas.Where(e => 
                    (string.IsNullOrEmpty(request.Termino) || 
                     (e.Titulo?.Contains(request.Termino, StringComparison.OrdinalIgnoreCase) == true) ||
                     (e.Contenido?.Contains(request.Termino, StringComparison.OrdinalIgnoreCase) == true)) &&
                    (!request.EstadoAnimo.HasValue || e.EstadoAnimo == request.EstadoAnimo) &&
                    (!request.FechaInicio.HasValue || e.FechaEntrada >= request.FechaInicio.Value.Date) &&
                    (!request.FechaFin.HasValue || e.FechaEntrada <= request.FechaFin.Value.Date)
                ).ToList();

                // Aplicar paginación
                var total = resultados.Count;
                var paginados = resultados
                    .Skip((request.Pagina - 1) * request.TamañoPagina)
                    .Take(request.TamañoPagina)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    message = "Búsqueda realizada exitosamente",
                    data = new
                    {
                        resultados = paginados,
                        total = total,
                        pagina = request.Pagina,
                        tamañoPagina = request.TamañoPagina,
                        totalPaginas = (int)Math.Ceiling((double)total / request.TamañoPagina)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al buscar entradas del diario para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene estadísticas del diario del usuario
        /// </summary>
        /// <param name="mes">Mes (opcional, si no se especifica usa el mes actual)</param>
        /// <param name="año">Año (opcional, si no se especifica usa el año actual)</param>
        /// <returns>Estadísticas del diario</returns>
        /// <response code="200">Estadísticas obtenidas exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("estadisticas")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetEstadisticas([FromQuery] int? mes = null, [FromQuery] int? año = null)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var mesConsulta = mes ?? fechaActual.Month;
                var añoConsulta = año ?? fechaActual.Year;

                if (mesConsulta < 1 || mesConsulta > 12)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "El mes debe estar entre 1 y 12"
                    });
                }

                if (añoConsulta < 1900 || añoConsulta > 2100)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "El año debe estar entre 1900 y 2100"
                    });
                }

                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo estadísticas del diario para mes {Mes}/{Año} del usuario: {UsuarioId}", mesConsulta, añoConsulta, usuarioId);

                var entradas = await _diarioService.GetEntradasAsync(usuarioId, mesConsulta, añoConsulta);

                var estadisticas = new
                {
                    totalEntradas = entradas.Count(),
                    entradasConTitulo = entradas.Count(e => e.TieneTitulo),
                    entradasConContenido = entradas.Count(e => e.TieneContenido),
                    totalPalabras = entradas.Sum(e => e.CantidadPalabras),
                    promedioPalabrasPorEntrada = entradas.Any() ? Math.Round((double)entradas.Sum(e => e.CantidadPalabras) / entradas.Count(), 1) : 0,
                    porEstadoAnimo = new
                    {
                        muyMal = entradas.Count(e => e.EstadoAnimo == 1),
                        mal = entradas.Count(e => e.EstadoAnimo == 2),
                        regular = entradas.Count(e => e.EstadoAnimo == 3),
                        bien = entradas.Count(e => e.EstadoAnimo == 4),
                        excelente = entradas.Count(e => e.EstadoAnimo == 5),
                        noEspecificado = entradas.Count(e => !e.EstadoAnimo.HasValue)
                    },
                    estadoAnimoPromedio = entradas.Any(e => e.EstadoAnimo.HasValue) 
                        ? Math.Round(entradas.Where(e => e.EstadoAnimo.HasValue).Average(e => e.EstadoAnimo!.Value), 1) 
                        : 0
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
                _logger.LogError(ex, "Error al obtener estadísticas del diario para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }
    }
} 