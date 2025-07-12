using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Carpetas
{
    /// <summary>
    /// Datos para actualizar una carpeta existente
    /// </summary>
    public class ActualizarCarpetaDto
    {
        /// <summary>
        /// Nuevo nombre de la carpeta
        /// </summary>
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(255, ErrorMessage = "El nombre no puede exceder 255 caracteres")]
        [MinLength(1, ErrorMessage = "El nombre debe tener al menos 1 caracter")]
        public string Nombre { get; set; } = string.Empty;

        /// <summary>
        /// Nueva descripción de la carpeta
        /// </summary>
        [StringLength(500, ErrorMessage = "La descripción no puede exceder 500 caracteres")]
        public string? Descripcion { get; set; }

        /// <summary>
        /// Nuevo color de la carpeta
        /// </summary>
        [Required(ErrorMessage = "El color es requerido")]
        [RegularExpression("^#[0-9A-Fa-f]{6}$", ErrorMessage = "El color debe tener formato hexadecimal válido (#RRGGBB)")]
        public string Color { get; set; } = "#3B82F6";

        /// <summary>
        /// Nuevo icono de la carpeta
        /// </summary>
        [Required(ErrorMessage = "El icono es requerido")]
        [StringLength(50, ErrorMessage = "El icono no puede exceder 50 caracteres")]
        public string Icono { get; set; } = "carpeta";
    }
}
