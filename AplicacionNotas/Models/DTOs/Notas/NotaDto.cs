namespace AplicacionNotas.Models.DTOs.Notas
{
    /// <summary>
    /// Información completa de una nota
    /// </summary>
    public class NotaDto
    {
        /// <summary>
        /// ID único de la nota
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// ID del usuario propietario
        /// </summary>
        public int UsuarioId { get; set; }

        /// <summary>
        /// ID de la carpeta (null si no está en carpeta)
        /// </summary>
        public int? CarpetaId { get; set; }

        /// <summary>
        /// Título de la nota
        /// </summary>
        public string Titulo { get; set; } = string.Empty;

        /// <summary>
        /// Contenido de la nota (puede ser HTML/Markdown)
        /// </summary>
        public string? Contenido { get; set; }

        /// <summary>
        /// Indica si la nota está marcada como favorita
        /// </summary>
        public bool Favorito { get; set; }

        /// <summary>
        /// Indica si la nota está archivada
        /// </summary>
        public bool Archivado { get; set; }

        /// <summary>
        /// Lista de etiquetas asociadas a la nota
        /// </summary>
        public List<string>? Etiquetas { get; set; } = new();

        /// <summary>
        /// Fecha de creación de la nota
        /// </summary>
        public DateTime FechaCreacion { get; set; }

        /// <summary>
        /// Fecha de última actualización
        /// </summary>
        public DateTime FechaActualizacion { get; set; }

        // ====================================
        // INFORMACIÓN DE CARPETA
        // ====================================

        /// <summary>
        /// Nombre de la carpeta (si pertenece a una)
        /// </summary>
        public string? NombreCarpeta { get; set; }

        /// <summary>
        /// Color de la carpeta (si pertenece a una)
        /// </summary>
        public string? ColorCarpeta { get; set; }

        // ====================================
        // PROPIEDADES CALCULADAS
        // ====================================

        /// <summary>
        /// Indica si la nota tiene contenido
        /// </summary>
        public bool TieneContenido => !string.IsNullOrWhiteSpace(Contenido);

        /// <summary>
        /// Indica si la nota tiene etiquetas
        /// </summary>
        public bool TieneEtiquetas => Etiquetas != null && Etiquetas.Any();

        /// <summary>
        /// Cantidad de etiquetas
        /// </summary>
        public int CantidadEtiquetas => Etiquetas?.Count ?? 0;

        /// <summary>
        /// Vista previa del contenido (primeros 150 caracteres)
        /// </summary>
        public string VistaPrevia
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Contenido))
                    return "Sin contenido";

                // Remover HTML básico si existe
                var contenidoLimpio = System.Text.RegularExpressions.Regex
                    .Replace(Contenido, "<.*?>", string.Empty);

                return contenidoLimpio.Length <= 150
                    ? contenidoLimpio
                    : contenidoLimpio.Substring(0, 150) + "...";
            }
        }

        /// <summary>
        /// Tiempo transcurrido desde la última actualización
        /// </summary>
        public string TiempoTranscurrido
        {
            get
            {
                var diferencia = DateTime.UtcNow - FechaActualizacion;

                if (diferencia.TotalMinutes < 1)
                    return "Hace un momento";
                if (diferencia.TotalMinutes < 60)
                    return $"Hace {(int)diferencia.TotalMinutes} minuto{((int)diferencia.TotalMinutes == 1 ? "" : "s")}";
                if (diferencia.TotalHours < 24)
                    return $"Hace {(int)diferencia.TotalHours} hora{((int)diferencia.TotalHours == 1 ? "" : "s")}";
                if (diferencia.TotalDays < 30)
                    return $"Hace {(int)diferencia.TotalDays} día{((int)diferencia.TotalDays == 1 ? "" : "s")}";
                if (diferencia.TotalDays < 365)
                    return $"Hace {(int)(diferencia.TotalDays / 30)} mes{((int)(diferencia.TotalDays / 30) == 1 ? "" : "es")}";

                return $"Hace {(int)(diferencia.TotalDays / 365)} año{((int)(diferencia.TotalDays / 365) == 1 ? "" : "s")}";
            }
        }

        /// <summary>
        /// Estimación de tiempo de lectura en minutos
        /// </summary>
        public int TiempoLecturaMinutos
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Contenido))
                    return 0;

                var palabras = Contenido.Split(new char[] { ' ', '\n', '\r', '\t' },
                    StringSplitOptions.RemoveEmptyEntries).Length;

                // Promedio de 200 palabras por minuto
                return Math.Max(1, (int)Math.Ceiling(palabras / 200.0));
            }
        }

        /// <summary>
        /// Conteo de palabras en el contenido
        /// </summary>
        public int CantidadPalabras
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Contenido))
                    return 0;

                return Contenido.Split(new char[] { ' ', '\n', '\r', '\t' },
                    StringSplitOptions.RemoveEmptyEntries).Length;
            }
        }

        /// <summary>
        /// Estado de la nota para UI
        /// </summary>
        public string Estado
        {
            get
            {
                if (Archivado) return "Archivada";
                if (Favorito) return "Favorita";
                return "Normal";
            }
        }
    }
}
