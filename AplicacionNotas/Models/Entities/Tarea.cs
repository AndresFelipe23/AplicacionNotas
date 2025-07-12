using System;
using System.Collections.Generic;

namespace AplicacionNotas.Models.Entities;

public partial class Tarea
{
    public int TarId { get; set; }

    public int TarUsuarioId { get; set; }

    public string TarTitulo { get; set; } = null!;

    public string? TarDescripcion { get; set; }

    public bool? TarCompletada { get; set; }

    public int? TarPrioridad { get; set; }

    public DateTime? TarFechaVencimiento { get; set; }

    public DateTime? TarFechaCompletada { get; set; }

    public DateTime? TarFechaCreacion { get; set; }

    public DateTime? TarFechaActualizacion { get; set; }

    public bool? TarEliminado { get; set; }

    public DateTime? TarFechaEliminacion { get; set; }

    public string? TarEstado { get; set; } = "pendiente"; // Estado para Kanban: pendiente, en_progreso, completada

    public virtual Usuario TarUsuario { get; set; } = null!;
}
