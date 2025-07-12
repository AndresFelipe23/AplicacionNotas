using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Diario
{
    /// <summary>
    /// Datos para buscar entradas del diario
    /// </summary>
    public class BuscarEntradasDiarioDto
    {
        /// <summary>
        /// Texto a buscar en título y contenido
        /// </summary>
        [Required(ErrorMessage = "El término de búsqueda es requerido")]
        [StringLength(100, ErrorMessage = "El término de búsqueda no puede exceder 100 caracteres")]
        [MinLength(2, ErrorMessage = "El término de búsqueda debe tener al menos 2 caracteres")]
        public string Termino { get; set; } = string.Empty;

        /// <summary>
        /// Fecha de inicio para el rango de búsqueda
        /// </summary>
        public DateTime? FechaInicio { get; set; }

        /// <summary>
        /// Fecha de fin para el rango de búsqueda
        /// </summary>
        public DateTime? FechaFin { get; set; }

        /// <summary>
        /// Estado de ánimo específico a filtrar
        /// </summary>
        [Range(1, 5, ErrorMessage = "El estado de ánimo debe estar entre 1 y 5")]
        public int? EstadoAnimo { get; set; }

        /// <summary>
        /// Buscar solo en títulos
        /// </summary>
        public bool SoloTitulos { get; set; } = false;

        /// <summary>
        /// Buscar solo en contenido
        /// </summary>
        public bool SoloContenido { get; set; } = false;

        /// <summary>
        /// Número de página (para paginación)
        /// </summary>
        [Range(1, int.MaxValue, ErrorMessage = "El número de página debe ser mayor a 0")]
        public int Pagina { get; set; } = 1;

        /// <summary>
        /// Tamaño de página (para paginación)
        /// </summary>
        [Range(1, 100, ErrorMessage = "El tamaño de página debe estar entre 1 y 100")]
        public int TamañoPagina { get; set; } = 20;
    }
} 