namespace AplicacionNotas.Models.DTOs.Diario
{
    public class ActualizarEntradaDiarioDto
    {
        public string? Titulo { get; set; }
        public string? Contenido { get; set; }
        public int? EstadoAnimo { get; set; }
    }
}
