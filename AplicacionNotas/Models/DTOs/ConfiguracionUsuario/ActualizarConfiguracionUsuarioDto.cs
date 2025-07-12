using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.ConfiguracionUsuario
{
    /// <summary>
    /// DTO para actualizar la configuración de usuario
    /// </summary>
    public class ActualizarConfiguracionUsuarioDto
    {
        /// <summary>
        /// Tema de la aplicación (light, dark, auto)
        /// </summary>
        [RegularExpression(@"^(light|dark|auto)$", ErrorMessage = "El tema debe ser 'light', 'dark' o 'auto'")]
        public string? Tema { get; set; }

        /// <summary>
        /// Idioma de la aplicación (es, en, fr, pt)
        /// </summary>
        [RegularExpression(@"^(es|en|fr|pt)$", ErrorMessage = "El idioma debe ser 'es', 'en', 'fr' o 'pt'")]
        public string? Idioma { get; set; }

        /// <summary>
        /// Formato de fecha preferido
        /// </summary>
        [RegularExpression(@"^(dd/MM/yyyy|MM/dd/yyyy|yyyy-MM-dd|dd-MM-yyyy|MM-dd-yyyy)$", 
            ErrorMessage = "Formato de fecha no válido. Use: dd/MM/yyyy, MM/dd/yyyy, yyyy-MM-dd, dd-MM-yyyy o MM-dd-yyyy")]
        public string? FormatoFecha { get; set; }

        /// <summary>
        /// Indica si el diario requiere PIN para acceder
        /// </summary>
        public bool? DiarioPinRequerido { get; set; }

        /// <summary>
        /// Indica si las notificaciones están activadas
        /// </summary>
        public bool? NotificacionesActivadas { get; set; }
    }
} 