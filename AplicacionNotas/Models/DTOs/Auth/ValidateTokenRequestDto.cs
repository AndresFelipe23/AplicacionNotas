using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Auth
{
    /// <summary>
    /// DTO para validación de token
    /// </summary>
    public class ValidateTokenRequestDto
    {
        /// <summary>
        /// Token JWT a validar
        /// </summary>
        [Required(ErrorMessage = "El token es requerido")]
        public string Token { get; set; } = string.Empty;
    }
} 