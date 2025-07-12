using System;
using System.Collections.Generic;

namespace AplicacionNotas.Models.Entities;

public partial class Usuario
{
    public int UsuId { get; set; }

    public string UsuEmail { get; set; } = null!;

    public string UsuPasswordHash { get; set; } = null!;

    public string? UsuNombre { get; set; }

    public string? UsuApellido { get; set; }

    public DateTime? UsuFechaCreacion { get; set; }

    public DateTime? UsuFechaActualizacion { get; set; }

    public bool? UsuActivo { get; set; }

    public DateTime? UsuUltimoLogin { get; set; }

    public virtual ICollection<Carpeta> Carpeta { get; set; } = new List<Carpeta>();

    public virtual ConfiguracionUsuario? ConfiguracionUsuario { get; set; }

    public virtual ICollection<EntradasDiario> EntradasDiarios { get; set; } = new List<EntradasDiario>();

    public virtual ICollection<Nota> Nota { get; set; } = new List<Nota>();

    public virtual ICollection<Tarea> Tareas { get; set; } = new List<Tarea>();
}
