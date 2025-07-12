namespace AplicacionNotas.Models.DTOs.Diario
{
    public class DiarioDto
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public DateTime FechaEntrada { get; set; }
        public string? Titulo { get; set; }
        public string? Contenido { get; set; }
        public int? EstadoAnimo { get; set; } // 1=Muy mal, 2=Mal, 3=Regular, 4=Bien, 5=Excelente
        public string EstadoAnimoTexto { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaActualizacion { get; set; }
        public bool RequierePin { get; set; } = true;
    }
}
