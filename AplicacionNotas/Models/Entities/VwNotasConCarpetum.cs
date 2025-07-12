using System;
using System.Collections.Generic;

namespace AplicacionNotas.Models.Entities;

public partial class VwNotasConCarpetum
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public string Titulo { get; set; } = null!;

    public string? Contenido { get; set; }

    public bool? Favorito { get; set; }

    public bool? Archivado { get; set; }

    public string? Etiquetas { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public DateTime? FechaActualizacion { get; set; }

    public int? CarpetaId { get; set; }

    public string? NombreCarpeta { get; set; }

    public string? ColorCarpeta { get; set; }
}
