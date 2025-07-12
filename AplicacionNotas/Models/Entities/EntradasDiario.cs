using System;
using System.Collections.Generic;

namespace AplicacionNotas.Models.Entities;

public partial class EntradasDiario
{
    public int DiaId { get; set; }

    public int DiaUsuarioId { get; set; }

    public DateOnly DiaFechaEntrada { get; set; }

    public string? DiaTitulo { get; set; }

    public string? DiaContenido { get; set; }

    public int? DiaEstadoAnimo { get; set; }

    public string DiaPinHash { get; set; } = null!;

    public DateTime? DiaFechaCreacion { get; set; }

    public DateTime? DiaFechaActualizacion { get; set; }

    public bool? DiaEliminado { get; set; }

    public DateTime? DiaFechaEliminacion { get; set; }

    public virtual Usuario DiaUsuario { get; set; } = null!;
}
