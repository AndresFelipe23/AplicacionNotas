using AplicacionNotas.Models.DTOs.ConfiguracionUsuario;
using AplicacionNotas.Models.Entities;

namespace AplicacionNotas.Repositories.Interfaces
{
    public interface IConfiguracionUsuarioRepository
    {
        /// <summary>
        /// Obtiene la configuración de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Configuración del usuario o null si no existe</returns>
        Task<ConfiguracionUsuarioDto?> GetByUsuarioIdAsync(int usuarioId);

        /// <summary>
        /// Crea una nueva configuración para un usuario
        /// </summary>
        /// <param name="configuracion">Entidad de configuración</param>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>ID de la configuración creada</returns>
        Task<int> CreateAsync(ConfiguracionUsuario configuracion, int usuarioId);

        /// <summary>
        /// Actualiza la configuración de un usuario
        /// </summary>
        /// <param name="configuracion">Entidad de configuración actualizada</param>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> UpdateAsync(ConfiguracionUsuario configuracion, int usuarioId);

        /// <summary>
        /// Verifica si existe configuración para un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>True si existe configuración</returns>
        Task<bool> ExistsAsync(int usuarioId);
    }
} 