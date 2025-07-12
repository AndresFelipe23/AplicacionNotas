namespace AplicacionNotas.Models.DTOs.ConfiguracionUsuario
{
    /// <summary>
    /// DTO para la configuración de usuario
    /// </summary>
    public class ConfiguracionUsuarioDto
    {
        /// <summary>
        /// ID único de la configuración
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// ID del usuario propietario
        /// </summary>
        public int UsuarioId { get; set; }

        /// <summary>
        /// Tema de la aplicación (light, dark, auto)
        /// </summary>
        public string? Tema { get; set; }

        /// <summary>
        /// Idioma de la aplicación (es, en, fr, etc.)
        /// </summary>
        public string? Idioma { get; set; }

        /// <summary>
        /// Formato de fecha preferido (dd/MM/yyyy, MM/dd/yyyy, yyyy-MM-dd, etc.)
        /// </summary>
        public string? FormatoFecha { get; set; }

        /// <summary>
        /// Indica si el diario requiere PIN para acceder
        /// </summary>
        public bool? DiarioPinRequerido { get; set; }

        /// <summary>
        /// Indica si las notificaciones están activadas
        /// </summary>
        public bool? NotificacionesActivadas { get; set; }

        /// <summary>
        /// Fecha de creación de la configuración
        /// </summary>
        public DateTime? FechaCreacion { get; set; }

        /// <summary>
        /// Fecha de última actualización
        /// </summary>
        public DateTime? FechaActualizacion { get; set; }

        // ====================================
        // PROPIEDADES CALCULADAS
        // ====================================

        /// <summary>
        /// Tema para mostrar (con valor por defecto)
        /// </summary>
        public string TemaDisplay => Tema ?? "auto";

        /// <summary>
        /// Idioma para mostrar (con valor por defecto)
        /// </summary>
        public string IdiomaDisplay => Idioma ?? "es";

        /// <summary>
        /// Formato de fecha para mostrar (con valor por defecto)
        /// </summary>
        public string FormatoFechaDisplay => FormatoFecha ?? "dd/MM/yyyy";

        /// <summary>
        /// Indica si el diario requiere PIN (con valor por defecto)
        /// </summary>
        public bool DiarioPinRequeridoDisplay => DiarioPinRequerido ?? true;

        /// <summary>
        /// Indica si las notificaciones están activadas (con valor por defecto)
        /// </summary>
        public bool NotificacionesActivadasDisplay => NotificacionesActivadas ?? true;

        /// <summary>
        /// Nombre del tema en español
        /// </summary>
        public string TemaNombre => TemaDisplay switch
        {
            "light" => "Claro",
            "dark" => "Oscuro",
            "auto" => "Automático",
            _ => "Automático"
        };

        /// <summary>
        /// Nombre del idioma en español
        /// </summary>
        public string IdiomaNombre => IdiomaDisplay switch
        {
            "es" => "Español",
            "en" => "Inglés",
            "fr" => "Francés",
            "pt" => "Portugués",
            _ => "Español"
        };
    }
} 