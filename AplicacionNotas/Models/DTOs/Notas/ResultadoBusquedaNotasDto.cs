namespace AplicacionNotas.Models.DTOs.Notas
{
    public class ResultadoBusquedaNotasDto
    {
        /// <summary>
        /// Lista de notas encontradas
        /// </summary>
        public List<NotaDto> Notas { get; set; } = new();

        /// <summary>
        /// Total de notas encontradas (sin paginación)
        /// </summary>
        public int TotalNotas { get; set; }

        /// <summary>
        /// Página actual
        /// </summary>
        public int PaginaActual { get; set; }

        /// <summary>
        /// Tamaño de página
        /// </summary>
        public int TamanoPagina { get; set; }

        /// <summary>
        /// Total de páginas
        /// </summary>
        public int TotalPaginas => (int)Math.Ceiling((double)TotalNotas / TamanoPagina);

        /// <summary>
        /// Indica si hay página anterior
        /// </summary>
        public bool TienePaginaAnterior => PaginaActual > 1;

        /// <summary>
        /// Indica si hay página siguiente
        /// </summary>
        public bool TienePaginaSiguiente => PaginaActual < TotalPaginas;

        /// <summary>
        /// Término de búsqueda utilizado
        /// </summary>
        public string? TerminoBusqueda { get; set; }
    }
}
