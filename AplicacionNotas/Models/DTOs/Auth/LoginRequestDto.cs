using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Auth
{
    /// <summary>
    /// Datos requeridos para el login
    /// </summary>
    public class LoginRequestDto
    {
        /// <summary>
        /// Email del usuario
        /// </summary>
        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        [MaxLength(255, ErrorMessage = "El email no puede exceder 255 caracteres")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Contraseña del usuario
        /// </summary>
        [Required(ErrorMessage = "La contraseña es requerida")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        [MaxLength(100, ErrorMessage = "La contraseña no puede exceder 100 caracteres")]
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// Recordar sesión por más tiempo
        /// </summary>
        public bool RememberMe { get; set; } = false;
    }
}
