namespace AplicacionNotas.Models.DTOs.Diario
{
    public class CrearEntradaDiarioDto
    {
        public DateTime FechaEntrada { get; set; }
        public string? Titulo { get; set; }
        public string? Contenido { get; set; }
        public int? EstadoAnimo { get; set; }
    }
}
