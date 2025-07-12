using System;
using System.Collections.Generic;

namespace AplicacionNotas.Models.Entities;

public partial class Nota
{
    public int NotId { get; set; }

    public int NotUsuarioId { get; set; }

    public int? NotCarpetaId { get; set; }

    public string NotTitulo { get; set; } = null!;

    public string? NotContenido { get; set; }

    public bool? NotFavorito { get; set; }

    public bool? NotArchivado { get; set; }

    public string? NotEtiquetas { get; set; }

    public DateTime? NotFechaCreacion { get; set; }

    public DateTime? NotFechaActualizacion { get; set; }

    public bool? NotEliminado { get; set; }

    public DateTime? NotFechaEliminacion { get; set; }

    public virtual Carpeta? NotCarpeta { get; set; }

    public virtual Usuario NotUsuario { get; set; } = null!;
}
