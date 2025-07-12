using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Auth
{
    /// <summary>
    /// Datos requeridos para el registro
    /// </summary>
    public class RegisterRequestDto
    {
        /// <summary>
        /// Email del usuario (será único)
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
        /// Confirmación de contraseña
        /// </summary>
        [Required(ErrorMessage = "La confirmación de contraseña es requerida")]
        [Compare("Password", ErrorMessage = "Las contraseñas no coinciden")]
        public string ConfirmPassword { get; set; } = string.Empty;

        /// <summary>
        /// Nombre del usuario (opcional)
        /// </summary>
        [MaxLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres")]
        public string? Nombre { get; set; }

        /// <summary>
        /// Apellido del usuario (opcional)
        /// </summary>
        [MaxLength(100, ErrorMessage = "El apellido no puede exceder 100 caracteres")]
        public string? Apellido { get; set; }

        /// <summary>
        /// Acepta términos y condiciones
        /// </summary>
        [Range(typeof(bool), "true", "true", ErrorMessage = "Debe aceptar los términos y condiciones")]
        public bool AceptaTerminos { get; set; } = false;
    }
}
