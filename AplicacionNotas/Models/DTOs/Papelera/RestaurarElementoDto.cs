using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Papelera
{
    public class RestaurarElementoDto
    {
        /// <summary>
        /// Tipo de elemento a restaurar
        /// </summary>
        [Required(ErrorMessage = "El tipo de elemento es requerido")]
        [RegularExpression("^(nota|tarea|carpeta|diario)$", ErrorMessage = "Tipo de elemento no válido")]
        public string Tipo { get; set; } = string.Empty;

        /// <summary>
        /// ID del elemento a restaurar
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "El ID debe ser mayor a 0")]
        public int ElementoId { get; set; }
    }
}
