namespace AplicacionNotas.Models.DTOs.Notas
{
    public class NotaResumenDto
    {
        /// <summary>
        /// ID de la nota
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Título de la nota
        /// </summary>
        public string Titulo { get; set; } = string.Empty;

        /// <summary>
        /// Vista previa del contenido
        /// </summary>
        public string VistaPrevia { get; set; } = string.Empty;

        /// <summary>
        /// Indica si es favorita
        /// </summary>
        public bool Favorito { get; set; }

        /// <summary>
        /// Indica si está archivada
        /// </summary>
        public bool Archivado { get; set; }

        /// <summary>
        /// Cantidad de etiquetas
        /// </summary>
        public int CantidadEtiquetas { get; set; }

        /// <summary>
        /// Fecha de última actualización
        /// </summary>
        public DateTime FechaActualizacion { get; set; }

        /// <summary>
        /// Color de la carpeta (si tiene)
        /// </summary>
        public string? ColorCarpeta { get; set; }
    }
}
