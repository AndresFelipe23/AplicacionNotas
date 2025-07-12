using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AplicacionNotas.Models.DTOs.ConfiguracionUsuario;
using AplicacionNotas.Services.Interfaces;
using AplicacionNotas.Extensions;

namespace AplicacionNotas.Controllers
{
    /// <summary>
    /// Controlador para la configuración de usuario
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    public class ConfiguracionUsuarioController : ControllerBase
    {
        private readonly IConfiguracionUsuarioService _configuracionService;
        private readonly ILogger<ConfiguracionUsuarioController> _logger;

        public ConfiguracionUsuarioController(IConfiguracionUsuarioService configuracionService, ILogger<ConfiguracionUsuarioController> logger)
        {
            _configuracionService = configuracionService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene la configuración del usuario autenticado
        /// </summary>
        /// <returns>Configuración del usuario</returns>
        /// <response code="200">Configuración obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet]
        [ProducesResponseType(typeof(ConfiguracionUsuarioDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> GetConfiguracion()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Obteniendo configuración para el usuario: {UsuarioId}", usuarioId);

                var configuracion = await _configuracionService.GetConfiguracionAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Configuración obtenida exitosamente",
                    data = configuracion
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener configuración para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Actualiza la configuración del usuario autenticado
        /// </summary>
        /// <param name="request">Datos de configuración a actualizar</param>
        /// <returns>Configuración actualizada</returns>
        /// <response code="200">Configuración actualizada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpPut]
        [ProducesResponseType(typeof(ConfiguracionUsuarioDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> UpdateConfiguracion([FromBody] ActualizarConfiguracionUsuarioDto request)
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Actualizando configuración para el usuario: {UsuarioId}", usuarioId);

                var configuracion = await _configuracionService.UpdateConfiguracionAsync(request, usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Configuración actualizada exitosamente",
                    data = configuracion
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar configuración para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Restablece la configuración del usuario a valores por defecto
        /// </summary>
        /// <returns>Configuración restablecida</returns>
        /// <response code="200">Configuración restablecida exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpPost("reset")]
        [ProducesResponseType(typeof(ConfiguracionUsuarioDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> ResetConfiguracion()
        {
            try
            {
                var usuarioId = User.GetUserId();
                _logger.LogInformation("Restableciendo configuración para el usuario: {UsuarioId}", usuarioId);

                var configuracion = await _configuracionService.ResetConfiguracionAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Configuración restablecida exitosamente",
                    data = configuracion
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al restablecer configuración para el usuario: {UsuarioId}", User.GetUserId());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Obtiene las opciones disponibles de temas
        /// </summary>
        /// <returns>Lista de temas disponibles</returns>
        /// <response code="200">Temas obtenidos exitosamente</response>
        [HttpGet("temas")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult GetTemas()
        {
            var temas = new[]
            {
                new { valor = "light", nombre = "Claro", descripcion = "Tema claro para uso diurno" },
                new { valor = "dark", nombre = "Oscuro", descripcion = "Tema oscuro para uso nocturno" },
                new { valor = "auto", nombre = "Automático", descripcion = "Se adapta automáticamente al sistema" }
            };

            return Ok(new
            {
                success = true,
                message = "Temas obtenidos exitosamente",
                data = temas
            });
        }

        /// <summary>
        /// Obtiene las opciones disponibles de idiomas
        /// </summary>
        /// <returns>Lista de idiomas disponibles</returns>
        /// <response code="200">Idiomas obtenidos exitosamente</response>
        [HttpGet("idiomas")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult GetIdiomas()
        {
            var idiomas = new[]
            {
                new { valor = "es", nombre = "Español", nombreNativo = "Español" },
                new { valor = "en", nombre = "Inglés", nombreNativo = "English" },
                new { valor = "fr", nombre = "Francés", nombreNativo = "Français" },
                new { valor = "pt", nombre = "Portugués", nombreNativo = "Português" }
            };

            return Ok(new
            {
                success = true,
                message = "Idiomas obtenidos exitosamente",
                data = idiomas
            });
        }

        /// <summary>
        /// Obtiene las opciones disponibles de formatos de fecha
        /// </summary>
        /// <returns>Lista de formatos de fecha disponibles</returns>
        /// <response code="200">Formatos de fecha obtenidos exitosamente</response>
        [HttpGet("formatos-fecha")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult GetFormatosFecha()
        {
            var formatos = new[]
            {
                new { valor = "dd/MM/yyyy", nombre = "Día/Mes/Año", ejemplo = "25/12/2024" },
                new { valor = "MM/dd/yyyy", nombre = "Mes/Día/Año", ejemplo = "12/25/2024" },
                new { valor = "yyyy-MM-dd", nombre = "Año-Mes-Día", ejemplo = "2024-12-25" },
                new { valor = "dd-MM-yyyy", nombre = "Día-Mes-Año", ejemplo = "25-12-2024" },
                new { valor = "MM-dd-yyyy", nombre = "Mes-Día-Año", ejemplo = "12-25-2024" }
            };

            return Ok(new
            {
                success = true,
                message = "Formatos de fecha obtenidos exitosamente",
                data = formatos
            });
        }

        /// <summary>
        /// Obtiene información sobre las opciones de configuración disponibles
        /// </summary>
        /// <returns>Información de configuración</returns>
        /// <response code="200">Información obtenida exitosamente</response>
        [HttpGet("opciones")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult GetOpcionesConfiguracion()
        {
            var opciones = new
            {
                temas = new[]
                {
                    new { valor = "light", nombre = "Claro" },
                    new { valor = "dark", nombre = "Oscuro" },
                    new { valor = "auto", nombre = "Automático" }
                },
                idiomas = new[]
                {
                    new { valor = "es", nombre = "Español" },
                    new { valor = "en", nombre = "Inglés" },
                    new { valor = "fr", nombre = "Francés" },
                    new { valor = "pt", nombre = "Portugués" }
                },
                formatosFecha = new[]
                {
                    new { valor = "dd/MM/yyyy", nombre = "Día/Mes/Año" },
                    new { valor = "MM/dd/yyyy", nombre = "Mes/Día/Año" },
                    new { valor = "yyyy-MM-dd", nombre = "Año-Mes-Día" },
                    new { valor = "dd-MM-yyyy", nombre = "Día-Mes-Año" },
                    new { valor = "MM-dd-yyyy", nombre = "Mes-Día-Año" }
                },
                configuracionPorDefecto = new
                {
                    tema = "auto",
                    idioma = "es",
                    formatoFecha = "dd/MM/yyyy",
                    diarioPinRequerido = true,
                    notificacionesActivadas = true
                }
            };

            return Ok(new
            {
                success = true,
                message = "Opciones de configuración obtenidas exitosamente",
                data = opciones
            });
        }
    }
} 