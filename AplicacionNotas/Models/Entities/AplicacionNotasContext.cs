using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace AplicacionNotas.Models.Entities;

public partial class AplicacionNotasContext : DbContext
{
    public AplicacionNotasContext(DbContextOptions<AplicacionNotasContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Carpeta> Carpetas { get; set; }

    public virtual DbSet<ConfiguracionUsuario> ConfiguracionUsuarios { get; set; }

    public virtual DbSet<EntradasDiario> EntradasDiarios { get; set; }

    public virtual DbSet<Nota> Notas { get; set; }

    public virtual DbSet<Tarea> Tareas { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<VwNotasConCarpetum> VwNotasConCarpeta { get; set; }

    public virtual DbSet<VwPapelera> VwPapeleras { get; set; }

    public virtual DbSet<VwTareasPendiente> VwTareasPendientes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Carpeta>(entity =>
        {
            entity.HasKey(e => e.CarId).HasName("PK__Carpetas__7D16AEC4AF535373");

            entity.ToTable(tb => tb.HasTrigger("tr_Carpetas_FechaActualizacion"));

            entity.HasIndex(e => e.CarUsuarioId, "IX_Carpetas_UsuarioId");

            entity.Property(e => e.CarId).HasColumnName("CAR_Id");
            entity.Property(e => e.CarColor)
                .HasMaxLength(7)
                .HasDefaultValue("#3B82F6")
                .HasColumnName("CAR_Color");
            entity.Property(e => e.CarDescripcion)
                .HasMaxLength(500)
                .HasColumnName("CAR_Descripcion");
            entity.Property(e => e.CarEliminado)
                .HasDefaultValue(false)
                .HasColumnName("CAR_Eliminado");
            entity.Property(e => e.CarFechaActualizacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("CAR_FechaActualizacion");
            entity.Property(e => e.CarFechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("CAR_FechaCreacion");
            entity.Property(e => e.CarIcono)
                .HasMaxLength(50)
                .HasDefaultValue("carpeta")
                .HasColumnName("CAR_Icono");
            entity.Property(e => e.CarNombre)
                .HasMaxLength(255)
                .HasColumnName("CAR_Nombre");
            entity.Property(e => e.CarOrden)
                .HasDefaultValue(0)
                .HasColumnName("CAR_Orden");
            entity.Property(e => e.CarUsuarioId).HasColumnName("CAR_UsuarioId");

            entity.HasOne(d => d.CarUsuario).WithMany(p => p.Carpeta)
                .HasForeignKey(d => d.CarUsuarioId)
                .HasConstraintName("FK_Carpetas_Usuarios");
        });

        modelBuilder.Entity<ConfiguracionUsuario>(entity =>
        {
            entity.HasKey(e => e.ConId).HasName("PK__Configur__0387EBDD8B623E14");

            entity.ToTable("ConfiguracionUsuario", tb => tb.HasTrigger("tr_ConfiguracionUsuario_FechaActualizacion"));

            entity.HasIndex(e => e.ConUsuarioId, "UQ_ConfiguracionUsuario_Usuario").IsUnique();

            entity.Property(e => e.ConId).HasColumnName("CON_Id");
            entity.Property(e => e.ConDiarioPinRequerido)
                .HasDefaultValue(true)
                .HasColumnName("CON_DiarioPinRequerido");
            entity.Property(e => e.ConFechaActualizacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("CON_FechaActualizacion");
            entity.Property(e => e.ConFechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("CON_FechaCreacion");
            entity.Property(e => e.ConFormatoFecha)
                .HasMaxLength(20)
                .HasDefaultValue("DD/MM/YYYY")
                .HasColumnName("CON_FormatoFecha");
            entity.Property(e => e.ConIdioma)
                .HasMaxLength(10)
                .HasDefaultValue("es")
                .HasColumnName("CON_Idioma");
            entity.Property(e => e.ConNotificacionesActivadas)
                .HasDefaultValue(true)
                .HasColumnName("CON_NotificacionesActivadas");
            entity.Property(e => e.ConTema)
                .HasMaxLength(20)
                .HasDefaultValue("sistema")
                .HasColumnName("CON_Tema");
            entity.Property(e => e.ConUsuarioId).HasColumnName("CON_UsuarioId");

            entity.HasOne(d => d.ConUsuario).WithOne(p => p.ConfiguracionUsuario)
                .HasForeignKey<ConfiguracionUsuario>(d => d.ConUsuarioId)
                .HasConstraintName("FK_ConfiguracionUsuario_Usuarios");
        });

        modelBuilder.Entity<EntradasDiario>(entity =>
        {
            entity.HasKey(e => e.DiaId).HasName("PK__Entradas__F07067C90D1AFADA");

            entity.ToTable("EntradasDiario", tb => tb.HasTrigger("tr_EntradasDiario_FechaActualizacion"));

            entity.HasIndex(e => e.DiaEliminado, "IX_EntradasDiario_Eliminado").HasFilter("([DIA_Eliminado]=(0))");

            entity.HasIndex(e => new { e.DiaUsuarioId, e.DiaFechaEntrada }, "IX_EntradasDiario_UsuarioId_Fecha").IsDescending(false, true);

            entity.HasIndex(e => new { e.DiaUsuarioId, e.DiaFechaEntrada }, "UQ_EntradasDiario_UsuarioFecha").IsUnique();

            entity.Property(e => e.DiaId).HasColumnName("DIA_Id");
            entity.Property(e => e.DiaContenido).HasColumnName("DIA_Contenido");
            entity.Property(e => e.DiaEliminado)
                .HasDefaultValue(false)
                .HasColumnName("DIA_Eliminado");
            entity.Property(e => e.DiaEstadoAnimo).HasColumnName("DIA_EstadoAnimo");
            entity.Property(e => e.DiaFechaActualizacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("DIA_FechaActualizacion");
            entity.Property(e => e.DiaFechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("DIA_FechaCreacion");
            entity.Property(e => e.DiaFechaEliminacion).HasColumnName("DIA_FechaEliminacion");
            entity.Property(e => e.DiaFechaEntrada).HasColumnName("DIA_FechaEntrada");
            entity.Property(e => e.DiaPinHash)
                .HasMaxLength(500)
                .HasColumnName("DIA_PinHash");
            entity.Property(e => e.DiaTitulo)
                .HasMaxLength(500)
                .HasColumnName("DIA_Titulo");
            entity.Property(e => e.DiaUsuarioId).HasColumnName("DIA_UsuarioId");

            entity.HasOne(d => d.DiaUsuario).WithMany(p => p.EntradasDiarios)
                .HasForeignKey(d => d.DiaUsuarioId)
                .HasConstraintName("FK_EntradasDiario_Usuarios");
        });

        modelBuilder.Entity<Nota>(entity =>
        {
            entity.HasKey(e => e.NotId).HasName("PK__Notas__1FB3D6CAB46CEBEE");

            entity.ToTable(tb => tb.HasTrigger("tr_Notas_FechaActualizacion"));

            entity.HasIndex(e => e.NotCarpetaId, "IX_Notas_CarpetaId");

            entity.HasIndex(e => e.NotEliminado, "IX_Notas_Eliminado").HasFilter("([NOT_Eliminado]=(0))");

            entity.HasIndex(e => e.NotTitulo, "IX_Notas_Titulo");

            entity.HasIndex(e => new { e.NotUsuarioId, e.NotFechaCreacion }, "IX_Notas_UsuarioId_FechaCreacion").IsDescending(false, true);

            entity.Property(e => e.NotId).HasColumnName("NOT_Id");
            entity.Property(e => e.NotArchivado)
                .HasDefaultValue(false)
                .HasColumnName("NOT_Archivado");
            entity.Property(e => e.NotCarpetaId).HasColumnName("NOT_CarpetaId");
            entity.Property(e => e.NotContenido).HasColumnName("NOT_Contenido");
            entity.Property(e => e.NotEliminado)
                .HasDefaultValue(false)
                .HasColumnName("NOT_Eliminado");
            entity.Property(e => e.NotEtiquetas)
                .HasMaxLength(1000)
                .HasColumnName("NOT_Etiquetas");
            entity.Property(e => e.NotFavorito)
                .HasDefaultValue(false)
                .HasColumnName("NOT_Favorito");
            entity.Property(e => e.NotFechaActualizacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("NOT_FechaActualizacion");
            entity.Property(e => e.NotFechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("NOT_FechaCreacion");
            entity.Property(e => e.NotFechaEliminacion).HasColumnName("NOT_FechaEliminacion");
            entity.Property(e => e.NotTitulo)
                .HasMaxLength(500)
                .HasColumnName("NOT_Titulo");
            entity.Property(e => e.NotUsuarioId).HasColumnName("NOT_UsuarioId");

            entity.HasOne(d => d.NotCarpeta).WithMany(p => p.Nota)
                .HasForeignKey(d => d.NotCarpetaId)
                .HasConstraintName("FK_Notas_Carpetas");

            entity.HasOne(d => d.NotUsuario).WithMany(p => p.Nota)
                .HasForeignKey(d => d.NotUsuarioId)
                .HasConstraintName("FK_Notas_Usuarios");
        });

        modelBuilder.Entity<Tarea>(entity =>
        {
            entity.HasKey(e => e.TarId).HasName("PK__Tareas__83E2629FE1FB3D0A");

            entity.ToTable(tb => tb.HasTrigger("tr_Tareas_FechaActualizacion"));

            entity.HasIndex(e => e.TarCompletada, "IX_Tareas_Completada");

            entity.HasIndex(e => e.TarEliminado, "IX_Tareas_Eliminado").HasFilter("([TAR_Eliminado]=(0))");

            entity.HasIndex(e => new { e.TarUsuarioId, e.TarFechaVencimiento }, "IX_Tareas_UsuarioId_FechaVencimiento");

            entity.Property(e => e.TarId).HasColumnName("TAR_Id");
            entity.Property(e => e.TarCompletada)
                .HasDefaultValue(false)
                .HasColumnName("TAR_Completada");
            entity.Property(e => e.TarDescripcion).HasColumnName("TAR_Descripcion");
            entity.Property(e => e.TarEliminado)
                .HasDefaultValue(false)
                .HasColumnName("TAR_Eliminado");
            entity.Property(e => e.TarFechaActualizacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("TAR_FechaActualizacion");
            entity.Property(e => e.TarFechaCompletada).HasColumnName("TAR_FechaCompletada");
            entity.Property(e => e.TarFechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("TAR_FechaCreacion");
            entity.Property(e => e.TarFechaEliminacion).HasColumnName("TAR_FechaEliminacion");
            entity.Property(e => e.TarFechaVencimiento).HasColumnName("TAR_FechaVencimiento");
            entity.Property(e => e.TarPrioridad)
                .HasDefaultValue(1)
                .HasColumnName("TAR_Prioridad");
            entity.Property(e => e.TarTitulo)
                .HasMaxLength(500)
                .HasColumnName("TAR_Titulo");
            entity.Property(e => e.TarUsuarioId).HasColumnName("TAR_UsuarioId");

            entity.HasOne(d => d.TarUsuario).WithMany(p => p.Tareas)
                .HasForeignKey(d => d.TarUsuarioId)
                .HasConstraintName("FK_Tareas_Usuarios");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.UsuId).HasName("PK__Usuarios__0B483F5F79BB6D26");

            entity.ToTable(tb => tb.HasTrigger("tr_Usuarios_FechaActualizacion"));

            entity.HasIndex(e => e.UsuEmail, "UQ__Usuarios__E5ED6654417BC548").IsUnique();

            entity.Property(e => e.UsuId).HasColumnName("USU_Id");
            entity.Property(e => e.UsuActivo)
                .HasDefaultValue(true)
                .HasColumnName("USU_Activo");
            entity.Property(e => e.UsuApellido)
                .HasMaxLength(100)
                .HasColumnName("USU_Apellido");
            entity.Property(e => e.UsuEmail)
                .HasMaxLength(255)
                .HasColumnName("USU_Email");
            entity.Property(e => e.UsuFechaActualizacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("USU_FechaActualizacion");
            entity.Property(e => e.UsuFechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("USU_FechaCreacion");
            entity.Property(e => e.UsuNombre)
                .HasMaxLength(100)
                .HasColumnName("USU_Nombre");
            entity.Property(e => e.UsuPasswordHash)
                .HasMaxLength(500)
                .HasColumnName("USU_PasswordHash");
            entity.Property(e => e.UsuUltimoLogin).HasColumnName("USU_UltimoLogin");
        });

        modelBuilder.Entity<VwNotasConCarpetum>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_NotasConCarpeta");

            entity.Property(e => e.ColorCarpeta).HasMaxLength(7);
            entity.Property(e => e.Etiquetas).HasMaxLength(1000);
            entity.Property(e => e.NombreCarpeta).HasMaxLength(255);
            entity.Property(e => e.Titulo).HasMaxLength(500);
        });

        modelBuilder.Entity<VwPapelera>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Papelera");

            entity.Property(e => e.Categoria).HasMaxLength(255);
            entity.Property(e => e.Tipo)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Titulo).HasMaxLength(500);
        });

        modelBuilder.Entity<VwTareasPendiente>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_TareasPendientes");

            entity.Property(e => e.Estado)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Titulo).HasMaxLength(500);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
