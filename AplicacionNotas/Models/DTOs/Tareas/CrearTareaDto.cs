namespace AplicacionNotas.Models.DTOs.Tareas
{
    public class CrearTareaDto
    {
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int Prioridad { get; set; } = 1; // 1=Baja, 2=Media, 3=Alta, 4=Urgente
        public DateTime? FechaVencimiento { get; set; }
        public string Estado { get; set; } = "pendiente"; // Estado inicial: pendiente
    }
}
