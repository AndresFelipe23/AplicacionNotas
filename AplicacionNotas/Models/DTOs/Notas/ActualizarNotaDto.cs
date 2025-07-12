using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Notas
{
    public class ActualizarNotaDto
    {
        /// <summary>
        /// Nueva carpeta (null para mover a "Sin carpeta")
        /// </summary>
        public int? CarpetaId { get; set; }

        /// <summary>
        /// Nuevo título
        /// </summary>
        [Required(ErrorMessage = "El título es requerido")]
        [StringLength(500, ErrorMessage = "El título no puede exceder 500 caracteres")]
        [MinLength(1, ErrorMessage = "El título debe tener al menos 1 caracter")]
        public string Titulo { get; set; } = string.Empty;

        /// <summary>
        /// Nuevo contenido
        /// </summary>
        [StringLength(50000, ErrorMessage = "El contenido no puede exceder 50,000 caracteres")]
        public string? Contenido { get; set; }

        /// <summary>
        /// Estado de favorito
        /// </summary>
        public bool Favorito { get; set; }

        /// <summary>
        /// Estado de archivado
        /// </summary>
        public bool Archivado { get; set; }

        /// <summary>
        /// Nueva lista de etiquetas
        /// </summary>
        public List<string>? Etiquetas { get; set; } = new();
    }
}
