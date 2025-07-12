using AplicacionNotas.Models.DTOs.ConfiguracionUsuario;

namespace AplicacionNotas.Services.Interfaces
{
    public interface IConfiguracionUsuarioService
    {
        /// <summary>
        /// Obtiene la configuración del usuario autenticado
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Configuración del usuario</returns>
        Task<ConfiguracionUsuarioDto> GetConfiguracionAsync(int usuarioId);

        /// <summary>
        /// Actualiza la configuración del usuario
        /// </summary>
        /// <param name="request">Datos de configuración a actualizar</param>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Configuración actualizada</returns>
        Task<ConfiguracionUsuarioDto> UpdateConfiguracionAsync(ActualizarConfiguracionUsuarioDto request, int usuarioId);

        /// <summary>
        /// Restablece la configuración del usuario a valores por defecto
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Configuración restablecida</returns>
        Task<ConfiguracionUsuarioDto> ResetConfiguracionAsync(int usuarioId);
    }
} 