using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Notas
{
    public class BuscarNotasDto
    {
        /// <summary>
        /// Término de búsqueda
        /// </summary>
        [StringLength(255, ErrorMessage = "El término de búsqueda no puede exceder 255 caracteres")]
        public string? Termino { get; set; }

        /// <summary>
        /// Filtrar por carpeta específica
        /// </summary>
        public int? CarpetaId { get; set; }

        /// <summary>
        /// Filtrar solo favoritas
        /// </summary>
        public bool? SoloFavoritas { get; set; }

        /// <summary>
        /// Filtrar solo archivadas
        /// </summary>
        public bool? SoloArchivadas { get; set; }

        /// <summary>
        /// Filtrar por etiquetas específicas
        /// </summary>
        public List<string>? Etiquetas { get; set; }

        /// <summary>
        /// Fecha desde (para filtrar por rango)
        /// </summary>
        public DateTime? FechaDesde { get; set; }

        /// <summary>
        /// Fecha hasta (para filtrar por rango)
        /// </summary>
        public DateTime? FechaHasta { get; set; }

        /// <summary>
        /// Ordenar por campo
        /// </summary>
        public OrdenarPor OrdenarPor { get; set; } = OrdenarPor.FechaCreacion;

        /// <summary>
        /// Orden ascendente o descendente
        /// </summary>
        public bool Ascendente { get; set; } = false;

        /// <summary>
        /// Página actual (para paginación)
        /// </summary>
        [Range(1, int.MaxValue, ErrorMessage = "La página debe ser mayor a 0")]
        public int Pagina { get; set; } = 1;

        /// <summary>
        /// Cantidad de elementos por página
        /// </summary>
        [Range(1, 100, ErrorMessage = "El tamaño de página debe estar entre 1 y 100")]
        public int TamanoPagina { get; set; } = 20;
    }

    /// <summary>
    /// Opciones de ordenamiento para notas
    /// </summary>
    public enum OrdenarPor
    {
        FechaCreacion,
        FechaActualizacion,
        Titulo,
        CantidadPalabras
    }
}
