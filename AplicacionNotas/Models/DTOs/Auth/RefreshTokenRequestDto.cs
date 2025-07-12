namespace AplicacionNotas.Models.DTOs.Auth
{
    /// <summary>
    /// Solicitud para renovar token
    /// </summary>
    public class RefreshTokenRequestDto
    {
        /// <summary>
        /// Token actual a renovar
        /// </summary>
        public string Token { get; set; } = string.Empty;
    }
}
