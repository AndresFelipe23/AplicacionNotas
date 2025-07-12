using System;
using System.Collections.Generic;

namespace AplicacionNotas.Models.Entities;

public partial class VwPapelera
{
    public string Tipo { get; set; } = null!;

    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public string? Titulo { get; set; }

    public DateTime? FechaEliminacion { get; set; }

    public string? Categoria { get; set; }
}
