namespace AplicacionNotas.Models.DTOs.Auth
{
    /// <summary>
    /// Respuesta de autenticación exitosa (Login/Register)
    /// </summary>
    public class AuthResponseDto
    {
        /// <summary>
        /// ID único del usuario
        /// </summary>
        public int UsuarioId { get; set; }

        /// <summary>
        /// Email del usuario
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Nombre del usuario (opcional)
        /// </summary>
        public string? Nombre { get; set; }

        /// <summary>
        /// Apellido del usuario (opcional)
        /// </summary>
        public string? Apellido { get; set; }

        /// <summary>
        /// Token JWT para autenticación
        /// </summary>
        public string Token { get; set; } = string.Empty;

        /// <summary>
        /// Fecha y hora de expiración del token (UTC)
        /// </summary>
        public DateTime Expiration { get; set; }

        /// <summary>
        /// Nombre completo del usuario (calculado)
        /// </summary>
        public string NombreCompleto =>
            string.IsNullOrEmpty(Nombre) && string.IsNullOrEmpty(Apellido)
                ? Email
                : $"{Nombre} {Apellido}".Trim();

        /// <summary>
        /// Iniciales del usuario para avatar
        /// </summary>
        public string Iniciales
        {
            get
            {
                if (!string.IsNullOrEmpty(Nombre) || !string.IsNullOrEmpty(Apellido))
                {
                    var inicialNombre = !string.IsNullOrEmpty(Nombre) ? Nombre[0].ToString() : "";
                    var inicialApellido = !string.IsNullOrEmpty(Apellido) ? Apellido[0].ToString() : "";
                    return (inicialNombre + inicialApellido).ToUpper();
                }

                // Si no hay nombre/apellido, usar primeras 2 letras del email
                return Email.Length >= 2 ? Email.Substring(0, 2).ToUpper() : Email.ToUpper();
            }
        }

        /// <summary>
        /// Indica si el token está próximo a expirar (menos de 1 hora)
        /// </summary>
        public bool TokenProximoAExpirar =>
            Expiration.Subtract(DateTime.UtcNow).TotalHours < 1;

        /// <summary>
        /// Tiempo restante hasta la expiración del token
        /// </summary>
        public TimeSpan TiempoRestante =>
            Expiration > DateTime.UtcNow ? Expiration.Subtract(DateTime.UtcNow) : TimeSpan.Zero;
    }
}
