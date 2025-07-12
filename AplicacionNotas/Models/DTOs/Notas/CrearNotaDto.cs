using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Notas
{
    public class CrearNotaDto
    {
        /// <summary>
        /// ID de la carpeta (opcional)
        /// </summary>
        public int? CarpetaId { get; set; }

        /// <summary>
        /// Título de la nota
        /// </summary>
        [Required(ErrorMessage = "El título es requerido")]
        [StringLength(500, ErrorMessage = "El título no puede exceder 500 caracteres")]
        [MinLength(1, ErrorMessage = "El título debe tener al menos 1 caracter")]
        public string Titulo { get; set; } = string.Empty;

        /// <summary>
        /// Contenido de la nota
        /// </summary>
        [StringLength(50000, ErrorMessage = "El contenido no puede exceder 50,000 caracteres")]
        public string? Contenido { get; set; }

        /// <summary>
        /// Marcar como favorita al crear
        /// </summary>
        public bool Favorito { get; set; } = false;

        /// <summary>
        /// Lista de etiquetas
        /// </summary>
        public List<string>? Etiquetas { get; set; } = new();
    }
}
