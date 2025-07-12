using System;
using System.Collections.Generic;

namespace AplicacionNotas.Models.Entities;

public partial class VwTareasPendiente
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public string Titulo { get; set; } = null!;

    public string? Descripcion { get; set; }

    public int? Prioridad { get; set; }

    public DateTime? FechaVencimiento { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public string Estado { get; set; } = null!;
}
