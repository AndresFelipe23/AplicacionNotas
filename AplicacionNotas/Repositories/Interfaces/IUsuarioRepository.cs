using AplicacionNotas.Models.Entities;
using System.Threading.Tasks;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> GetByEmailAsync(string email);
        Task<Usuario?> GetByIdAsync(int id);
        Task<int> CreateAsync(string email, string passwordHash, string? nombre, string? apellido);
        Task<bool> ExistsByEmailAsync(string email);
        Task UpdateLastLoginAsync(int userId);

        // Métodos para PIN global de diario
        Task<bool> ActualizarPinDiarioAsync(int usuarioId, string pinHash);
        Task<bool> VerificarPinDiarioAsync(int usuarioId, string pinHash);
        Task<bool> TienePinDiarioAsync(int usuarioId);
    }
}
