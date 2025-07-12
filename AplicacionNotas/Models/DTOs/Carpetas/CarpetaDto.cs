namespace AplicacionNotas.Models.DTOs.Carpetas
{
    /// <summary>
    /// Información completa de una carpeta
    /// </summary>
    public class CarpetaDto
    {
        /// <summary>
        /// ID único de la carpeta
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// ID del usuario propietario
        /// </summary>
        public int UsuarioId { get; set; }

        /// <summary>
        /// Nombre de la carpeta
        /// </summary>
        public string Nombre { get; set; } = string.Empty;

        /// <summary>
        /// Descripción opcional de la carpeta
        /// </summary>
        public string? Descripcion { get; set; }

        /// <summary>
        /// Color de la carpeta en formato hexadecimal (#RRGGBB)
        /// </summary>
        public string Color { get; set; } = "#3B82F6";

        /// <summary>
        /// Nombre del icono para mostrar
        /// </summary>
        public string Icono { get; set; } = "carpeta";

        /// <summary>
        /// Orden de visualización (menor número = más arriba)
        /// </summary>
        public int Orden { get; set; }

        /// <summary>
        /// Fecha de creación de la carpeta
        /// </summary>
        public DateTime FechaCreacion { get; set; }

        /// <summary>
        /// Cantidad total de notas en esta carpeta
        /// </summary>
        public int CantidadNotas { get; set; }

        /// <summary>
        /// Indica si la carpeta está vacía
        /// </summary>
        public bool EstaVacia => CantidadNotas == 0;

        /// <summary>
        /// Descripción del contenido de la carpeta
        /// </summary>
        public string DescripcionContenido => CantidadNotas switch
        {
            0 => "Carpeta vacía",
            1 => "1 nota",
            _ => $"{CantidadNotas} notas"
        };

        /// <summary>
        /// Color con opacidad para fondos
        /// </summary>
        public string ColorConOpacidad => $"{Color}20"; // Agrega 20% de opacidad

        /// <summary>
        /// CSS class para el icono (para frontend)
        /// </summary>
        public string IconoClass => $"icon-{Icono}";
    }
}
