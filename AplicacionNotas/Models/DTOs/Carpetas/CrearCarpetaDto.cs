namespace AplicacionNotas.Models.DTOs.Carpetas
{
    public class CrearCarpetaDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Color { get; set; } = "#3B82F6";
        public string Icono { get; set; } = "carpeta";

    }
}
