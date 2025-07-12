using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Notas
{
    /// <summary>
    /// Datos para mover múltiples notas
    /// </summary>
    public class MoverNotasDto
    {
        /// <summary>
        /// IDs de las notas a mover
        /// </summary>
        [Required(ErrorMessage = "La lista de notas es requerida")]
        [MinLength(1, ErrorMessage = "Debe seleccionar al menos una nota")]
        public List<int> NotaIds { get; set; } = new();

        /// <summary>
        /// ID de la carpeta destino (null para "Sin carpeta")
        /// </summary>
        public int? CarpetaDestinoId { get; set; }
    }
}
