using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Papelera
{
    public class EliminarElementoDto
    {
        /// <summary>
        /// Tipo de elemento a eliminar
        /// </summary>
        [Required(ErrorMessage = "El tipo de elemento es requerido")]
        [RegularExpression("^(nota|tarea|carpeta|diario)$", ErrorMessage = "Tipo de elemento no válido")]
        public string Tipo { get; set; } = string.Empty;

        /// <summary>
        /// ID del elemento a eliminar
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "El ID debe ser mayor a 0")]
        public int ElementoId { get; set; }

        /// <summary>
        /// Confirmación explícita de eliminación permanente
        /// </summary>
        [Required]
        [Range(typeof(bool), "true", "true", ErrorMessage = "Debe confirmar la eliminación permanente")]
        public bool ConfirmarEliminacion { get; set; } = false;
    }
}
