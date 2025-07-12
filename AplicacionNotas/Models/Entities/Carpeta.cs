using System;
using System.Collections.Generic;

namespace AplicacionNotas.Models.Entities;

public partial class Carpeta
{
    public int CarId { get; set; }

    public int CarUsuarioId { get; set; }

    public string CarNombre { get; set; } = null!;

    public string? CarDescripcion { get; set; }

    public string? CarColor { get; set; }

    public string? CarIcono { get; set; }

    public int? CarOrden { get; set; }

    public DateTime? CarFechaCreacion { get; set; }

    public DateTime? CarFechaActualizacion { get; set; }

    public bool? CarEliminado { get; set; }

    public virtual Usuario CarUsuario { get; set; } = null!;

    public virtual ICollection<Nota> Nota { get; set; } = new List<Nota>();
}
