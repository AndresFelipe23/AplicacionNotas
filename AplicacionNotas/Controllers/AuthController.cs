using Microsoft.AspNetCore.Mvc;
using AplicacionNotas.Models.DTOs.Auth;
using AplicacionNotas.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using AplicacionNotas.Models.DTOs.Diario;
using AplicacionNotas.Repositories.Interfaces;
using AplicacionNotas.Helpers;
using AplicacionNotas.Extensions;

namespace AplicacionNotas.Controllers
{
    /// <summary>
    /// Controlador para operaciones de autenticación
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Inicia sesión de un usuario
        /// </summary>
        /// <param name="request">Datos de login</param>
        /// <returns>Token de autenticación y datos del usuario</returns>
        /// <response code="200">Login exitoso</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">Credenciales incorrectas</response>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponseDto), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                _logger.LogInformation("Intento de login para el usuario: {Email}", request.Email);

                var response = await _authService.LoginAsync(request);
                
                if (response == null)
                {
                    _logger.LogWarning("Login fallido para el usuario: {Email}", request.Email);
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Email o contraseña incorrectos"
                    });
                }

                _logger.LogInformation("Login exitoso para el usuario: {Email}", request.Email);
                
                return Ok(new
                {
                    success = true,
                    message = "Login exitoso",
                    data = response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error durante el login para el usuario: {Email}", request.Email);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Registra un nuevo usuario
        /// </summary>
        /// <param name="request">Datos de registro</param>
        /// <returns>Token de autenticación y datos del usuario</returns>
        /// <response code="201">Usuario creado exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="409">El email ya está registrado</response>
        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResponseDto), 201)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 409)]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            try
            {
                _logger.LogInformation("Intento de registro para el usuario: {Email}", request.Email);

                var response = await _authService.RegisterAsync(request);
                
                if (response == null)
                {
                    _logger.LogWarning("Registro fallido - email ya existe: {Email}", request.Email);
                    return Conflict(new
                    {
                        success = false,
                        message = "El email ya está registrado"
                    });
                }

                _logger.LogInformation("Registro exitoso para el usuario: {Email}", request.Email);
                
                return CreatedAtAction(nameof(Login), new
                {
                    success = true,
                    message = "Usuario registrado exitosamente",
                    data = response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error durante el registro para el usuario: {Email}", request.Email);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Valida un token JWT
        /// </summary>
        /// <param name="request">Datos del token a validar</param>
        /// <returns>Estado de validez del token</returns>
        /// <response code="200">Token válido</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">Token inválido</response>
        [HttpPost("validate")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequestDto request)
        {
            try
            {
                var isValid = await _authService.ValidateTokenAsync(request.Token);
                
                if (!isValid)
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Token inválido o expirado"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Token válido",
                    data = new { isValid = true }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al validar token");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Verifica si el usuario actual está autenticado
        /// </summary>
        /// <returns>Información del usuario autenticado</returns>
        /// <response code="200">Usuario autenticado</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public IActionResult GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Usuario no autenticado"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Usuario autenticado",
                    data = new
                    {
                        userId = int.Parse(userId),
                        email
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener información del usuario actual");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

        /// <summary>
        /// Endpoint de prueba para verificar que la API está funcionando
        /// </summary>
        /// <returns>Mensaje de estado</returns>
        [HttpGet("health")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult HealthCheck()
        {
            return Ok(new
            {
                success = true,
                message = "API de autenticación funcionando correctamente",
                timestamp = DateTime.UtcNow,
                version = "1.0.0"
            });
        }
    }

    [ApiController]
    [Route("api/usuario")]
    [Authorize]
    public class DiarioPinController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPasswordHelper _passwordHelper;

        public DiarioPinController(IUsuarioRepository usuarioRepository, IPasswordHelper passwordHelper)
        {
            _usuarioRepository = usuarioRepository;
            _passwordHelper = passwordHelper;
        }

        [HttpPost("diario/pin")]
        public async Task<IActionResult> SetPinDiario([FromBody] SetPinDiarioDto dto)
        {
            var usuarioId = User.GetUserId();
            var pinHash = _passwordHelper.HashPin(dto.Pin);
            var ok = await _usuarioRepository.ActualizarPinDiarioAsync(usuarioId, pinHash);
            return Ok(new { success = ok });
        }

        [HttpPost("diario/verificar-pin")]
        public async Task<IActionResult> VerificarPinDiario([FromBody] VerificarPinDiarioDto dto)
        {
            var usuarioId = User.GetUserId();
            var valido = await _usuarioRepository.VerificarPinDiarioAsync(usuarioId, dto.Pin);
            return Ok(new { success = valido });
        }

        [HttpGet("diario/tiene-pin")]
        public async Task<IActionResult> TienePinDiario()
        {
            var usuarioId = User.GetUserId();
            var tienePin = await _usuarioRepository.TienePinDiarioAsync(usuarioId);
            return Ok(new { tienePin });
        }

        [HttpPost("diario/verificar-password")]
        public async Task<IActionResult> VerificarPassword([FromBody] VerificarPasswordDto dto)
        {
            var usuarioId = User.GetUserId();
            var usuario = await _usuarioRepository.GetByIdAsync(usuarioId);
            if (usuario == null) return Unauthorized();

            var esValida = _passwordHelper.VerifyPassword(dto.Password, usuario.UsuPasswordHash);
            return Ok(new { success = esValida });
        }
    }
} 