using AplicacionNotas.Helpers;
using AplicacionNotas.Models.DTOs.Auth;
using AplicacionNotas.Repositories.Interfaces;
using AutoMapper;

namespace AplicacionNotas.Repositories.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPasswordHelper _passwordHelper;
        private readonly IJwtHelper _jwtHelper;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AuthService(
            IUsuarioRepository usuarioRepository,
            IPasswordHelper passwordHelper,
            IJwtHelper jwtHelper,
            IMapper mapper,
            IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _passwordHelper = passwordHelper;
            _jwtHelper = jwtHelper;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
        {
            // Buscar usuario por email
            var usuario = await _usuarioRepository.GetByEmailAsync(request.Email);
            if (usuario == null)
            {
                return null;
            }

            // Verificar contraseña
            if (!_passwordHelper.VerifyPassword(request.Password, usuario.UsuPasswordHash))
            {
                return null;
            }

            // Actualizar último login
            await _usuarioRepository.UpdateLastLoginAsync(usuario.UsuId);

            // Generar token
            var token = _jwtHelper.GenerateToken(usuario.UsuId, usuario.UsuEmail);

            // Obtener configuración de expiración
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var expirationHours = int.Parse(jwtSettings["ExpirationInHours"] ?? "24");

            // Mapear respuesta
            var response = _mapper.Map<AuthResponseDto>(usuario);
            response.Token = token;
            response.Expiration = DateTime.UtcNow.AddHours(expirationHours);

            return response;
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
        {
            // Verificar si el email ya existe
            if (await _usuarioRepository.ExistsByEmailAsync(request.Email))
            {
                return null;
            }

            // Hash de la contraseña
            var passwordHash = _passwordHelper.HashPassword(request.Password);

            // Crear usuario
            var usuarioId = await _usuarioRepository.CreateAsync(
                request.Email,
                passwordHash,
                request.Nombre,
                request.Apellido
            );

            // Obtener el usuario creado
            var usuario = await _usuarioRepository.GetByIdAsync(usuarioId);
            if (usuario == null)
            {
                return null;
            }

            // Validar que el usuario tenga email
            if (string.IsNullOrEmpty(usuario.UsuEmail))
            {
                throw new InvalidOperationException($"El usuario creado con ID {usuarioId} no tiene email");
            }

            // Generar token
            var token = _jwtHelper.GenerateToken(usuario.UsuId, usuario.UsuEmail);

            // Obtener configuración de expiración
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var expirationHours = int.Parse(jwtSettings["ExpirationInHours"] ?? "24");

            // Mapear respuesta
            var response = _mapper.Map<AuthResponseDto>(usuario);
            response.Token = token;
            response.Expiration = DateTime.UtcNow.AddHours(expirationHours);

            return response;
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            var userId = _jwtHelper.ValidateToken(token);
            if (userId == null)
            {
                return false;
            }

            var usuario = await _usuarioRepository.GetByIdAsync(userId.Value);
            return usuario != null && usuario.UsuActivo == true;
        }
    }
}
