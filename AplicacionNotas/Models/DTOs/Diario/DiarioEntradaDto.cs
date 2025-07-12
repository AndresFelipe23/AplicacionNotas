namespace AplicacionNotas.Models.DTOs.Diario
{
    public class DiarioEntradaDto
    {
        /// <summary>
        /// ID único de la entrada
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// ID del usuario propietario
        /// </summary>
        public int UsuarioId { get; set; }

        /// <summary>
        /// Fecha de la entrada (solo fecha, sin hora)
        /// </summary>
        public DateTime FechaEntrada { get; set; }

        /// <summary>
        /// Título opcional de la entrada
        /// </summary>
        public string? Titulo { get; set; }

        /// <summary>
        /// Contenido de la entrada del diario
        /// </summary>
        public string? Contenido { get; set; }

        /// <summary>
        /// Estado de ánimo (1=Muy mal, 2=Mal, 3=Regular, 4=Bien, 5=Excelente)
        /// </summary>
        public int? EstadoAnimo { get; set; }

        /// <summary>
        /// Descripción textual del estado de ánimo
        /// </summary>
        public string EstadoAnimoTexto { get; set; } = string.Empty;

        /// <summary>
        /// Fecha de creación de la entrada
        /// </summary>
        public DateTime FechaCreacion { get; set; }

        /// <summary>
        /// Fecha de última actualización
        /// </summary>
        public DateTime FechaActualizacion { get; set; }

        /// <summary>
        /// Indica si esta entrada requiere PIN para acceder
        /// </summary>
        public bool RequierePin { get; set; } = true;

        // ====================================
        // PROPIEDADES CALCULADAS
        // ====================================

        /// <summary>
        /// Indica si la entrada tiene contenido
        /// </summary>
        public bool TieneContenido => !string.IsNullOrWhiteSpace(Contenido);

        /// <summary>
        /// Indica si la entrada tiene título personalizado
        /// </summary>
        public bool TieneTitulo => !string.IsNullOrWhiteSpace(Titulo);

        /// <summary>
        /// Título para mostrar (personalizado o fecha)
        /// </summary>
        public string TituloDisplay =>
            TieneTitulo ? Titulo! : $"Entrada del {FechaEntrada:dd/MM/yyyy}";

        /// <summary>
        /// Vista previa del contenido (primeros 100 caracteres)
        /// </summary>
        public string VistaPrevia
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Contenido))
                    return "Sin contenido";

                return Contenido.Length <= 100
                    ? Contenido
                    : Contenido.Substring(0, 100) + "...";
            }
        }

        /// <summary>
        /// Emoji del estado de ánimo
        /// </summary>
        public string EmojiEstadoAnimo => EstadoAnimo switch
        {
            1 => "😢", // Muy mal
            2 => "😔", // Mal
            3 => "😐", // Regular
            4 => "😊", // Bien
            5 => "😁", // Excelente
            _ => "❓"  // No especificado
        };

        /// <summary>
        /// Color asociado al estado de ánimo
        /// </summary>
        public string ColorEstadoAnimo => EstadoAnimo switch
        {
            1 => "#EF4444", // Rojo
            2 => "#F97316", // Naranja
            3 => "#F59E0B", // Amarillo
            4 => "#10B981", // Verde
            5 => "#22C55E", // Verde brillante
            _ => "#6B7280"  // Gris
        };

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
        /// Día de la semana de la entrada
        /// </summary>
        public string DiaSemana => FechaEntrada.ToString("dddd", new System.Globalization.CultureInfo("es-ES"));
    }
}
