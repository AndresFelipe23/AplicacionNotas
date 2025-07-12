namespace AplicacionNotas.Models.DTOs.Carpetas
{
    /// <summary>
    /// Resumen básico de una carpeta (para listas)
    /// </summary>
    public class CarpetaResumenDto
    {
        /// <summary>
        /// ID de la carpeta
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nombre de la carpeta
        /// </summary>
        public string Nombre { get; set; } = string.Empty;

        /// <summary>
        /// Color de la carpeta
        /// </summary>
        public string Color { get; set; } = "#3B82F6";

        /// <summary>
        /// Icono de la carpeta
        /// </summary>
        public string Icono { get; set; } = "carpeta";

        /// <summary>
        /// Cantidad de notas
        /// </summary>
        public int CantidadNotas { get; set; }
    }
}
