using AplicacionNotas.Models.DTOs.Auth;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
        Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
        Task<bool> ValidateTokenAsync(string token);
    }
}
