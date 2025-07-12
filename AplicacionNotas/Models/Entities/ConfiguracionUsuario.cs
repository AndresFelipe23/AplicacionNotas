using System;
using System.Collections.Generic;

namespace AplicacionNotas.Models.Entities;

public partial class ConfiguracionUsuario
{
    public int ConId { get; set; }

    public int ConUsuarioId { get; set; }

    public string? ConTema { get; set; }

    public string? ConIdioma { get; set; }

    public string? ConFormatoFecha { get; set; }

    public bool? ConDiarioPinRequerido { get; set; }

    public bool? ConNotificacionesActivadas { get; set; }

    public DateTime? ConFechaCreacion { get; set; }

    public DateTime? ConFechaActualizacion { get; set; }

    public virtual Usuario ConUsuario { get; set; } = null!;
}
