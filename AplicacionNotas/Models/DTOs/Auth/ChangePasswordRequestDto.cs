using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Auth
{
    /// <summary>
    /// Solicitud para cambiar contraseña
    /// </summary>
    public class ChangePasswordRequestDto
    {
        /// <summary>
        /// Contraseña actual
        /// </summary>
        [Required(ErrorMessage = "La contraseña actual es requerida")]
        public string CurrentPassword { get; set; } = string.Empty;

        /// <summary>
        /// Nueva contraseña
        /// </summary>
        [Required(ErrorMessage = "La nueva contraseña es requerida")]
        [MinLength(6, ErrorMessage = "La nueva contraseña debe tener al menos 6 caracteres")]
        [MaxLength(100, ErrorMessage = "La nueva contraseña no puede exceder 100 caracteres")]
        public string NewPassword { get; set; } = string.Empty;

        /// <summary>
        /// Confirmación de nueva contraseña
        /// </summary>
        [Required(ErrorMessage = "La confirmación de nueva contraseña es requerida")]
        [Compare("NewPassword", ErrorMessage = "Las nuevas contraseñas no coinciden")]
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }
}
