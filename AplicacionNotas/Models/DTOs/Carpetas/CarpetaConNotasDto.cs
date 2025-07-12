using AplicacionNotas.Models.DTOs.Notas;

namespace AplicacionNotas.Models.DTOs.Carpetas
{
    /// <summary>
    /// Carpeta con sus notas incluidas
    /// </summary>
    public class CarpetaConNotasDto : CarpetaDto
    {
        /// <summary>
        /// Lista de notas dentro de esta carpeta
        /// </summary>
        public List<NotaDto> Notas { get; set; } = new();

        /// <summary>
        /// Fecha de la última nota modificada en esta carpeta
        /// </summary>
        public DateTime? FechaUltimaActividad =>
            Notas.Any() ? Notas.Max(n => n.FechaActualizacion) : null;

        /// <summary>
        /// Cantidad de notas favoritas en esta carpeta
        /// </summary>
        public int NotasFavoritas => Notas.Count(n => n.Favorito);

        /// <summary>
        /// Cantidad de notas archivadas en esta carpeta
        /// </summary>
        public int NotasArchivadas => Notas.Count(n => n.Archivado);
    }
}
