using AplicacionNotas.Models.DTOs.Auth;
using AplicacionNotas.Models.DTOs.Carpetas;
using AplicacionNotas.Models.DTOs.Diario;
using AplicacionNotas.Models.DTOs.Notas;
using AplicacionNotas.Models.DTOs.Tareas;
using AplicacionNotas.Models.Entities;
using AutoMapper;
using Newtonsoft.Json;

namespace AplicacionNotas.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ====================================
            // MAPEOS DE USUARIO
            // ====================================
            CreateMap<Usuario, AuthResponseDto>()
                .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => src.UsuId))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.UsuEmail))
                .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.UsuNombre))
                .ForMember(dest => dest.Apellido, opt => opt.MapFrom(src => src.UsuApellido))
                .ForMember(dest => dest.Token, opt => opt.Ignore())
                .ForMember(dest => dest.Expiration, opt => opt.Ignore());

            // ====================================
            // MAPEOS DE NOTAS
            // ====================================
            CreateMap<Nota, NotaDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.NotId))
                .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => src.NotUsuarioId))
                .ForMember(dest => dest.CarpetaId, opt => opt.MapFrom(src => src.NotCarpetaId))
                .ForMember(dest => dest.Titulo, opt => opt.MapFrom(src => src.NotTitulo))
                .ForMember(dest => dest.Contenido, opt => opt.MapFrom(src => src.NotContenido))
                .ForMember(dest => dest.Favorito, opt => opt.MapFrom(src => src.NotFavorito))
                .ForMember(dest => dest.Archivado, opt => opt.MapFrom(src => src.NotArchivado))
                .ForMember(dest => dest.FechaCreacion, opt => opt.MapFrom(src => src.NotFechaCreacion))
                .ForMember(dest => dest.FechaActualizacion, opt => opt.MapFrom(src => src.NotFechaActualizacion))
                .ForMember(dest => dest.Etiquetas, opt => opt.MapFrom(src =>
                    string.IsNullOrEmpty(src.NotEtiquetas) ?
                    new List<string>() :
                    JsonConvert.DeserializeObject<List<string>>(src.NotEtiquetas)))
                .ForMember(dest => dest.NombreCarpeta, opt => opt.Ignore())
                .ForMember(dest => dest.ColorCarpeta, opt => opt.Ignore());

            CreateMap<CrearNotaDto, Nota>()
                .ForMember(dest => dest.NotCarpetaId, opt => opt.MapFrom(src => src.CarpetaId))
                .ForMember(dest => dest.NotTitulo, opt => opt.MapFrom(src => src.Titulo))
                .ForMember(dest => dest.NotContenido, opt => opt.MapFrom(src => src.Contenido))
                .ForMember(dest => dest.NotFavorito, opt => opt.MapFrom(src => src.Favorito))
                .ForMember(dest => dest.NotEtiquetas, opt => opt.MapFrom(src =>
                    src.Etiquetas != null && src.Etiquetas.Any() ?
                    JsonConvert.SerializeObject(src.Etiquetas) :
                    null))
                .ForMember(dest => dest.NotId, opt => opt.Ignore())
                .ForMember(dest => dest.NotUsuarioId, opt => opt.Ignore())
                .ForMember(dest => dest.NotArchivado, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.NotEliminado, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.NotFechaCreacion, opt => opt.Ignore())
                .ForMember(dest => dest.NotFechaActualizacion, opt => opt.Ignore())
                .ForMember(dest => dest.NotFechaEliminacion, opt => opt.Ignore());

            CreateMap<ActualizarNotaDto, Nota>()
                .ForMember(dest => dest.NotCarpetaId, opt => opt.MapFrom(src => src.CarpetaId))
                .ForMember(dest => dest.NotTitulo, opt => opt.MapFrom(src => src.Titulo))
                .ForMember(dest => dest.NotContenido, opt => opt.MapFrom(src => src.Contenido))
                .ForMember(dest => dest.NotFavorito, opt => opt.MapFrom(src => src.Favorito))
                .ForMember(dest => dest.NotArchivado, opt => opt.MapFrom(src => src.Archivado))
                .ForMember(dest => dest.NotEtiquetas, opt => opt.MapFrom(src =>
                    src.Etiquetas != null && src.Etiquetas.Any() ?
                    JsonConvert.SerializeObject(src.Etiquetas) :
                    null))
                .ForMember(dest => dest.NotId, opt => opt.Ignore())
                .ForMember(dest => dest.NotUsuarioId, opt => opt.Ignore())
                .ForMember(dest => dest.NotEliminado, opt => opt.Ignore())
                .ForMember(dest => dest.NotFechaCreacion, opt => opt.Ignore())
                .ForMember(dest => dest.NotFechaActualizacion, opt => opt.Ignore())
                .ForMember(dest => dest.NotFechaEliminacion, opt => opt.Ignore());

            // ====================================
            // MAPEOS DE TAREAS
            // ====================================
            CreateMap<Tarea, TareaDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.TarId))
                .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => src.TarUsuarioId))
                .ForMember(dest => dest.Titulo, opt => opt.MapFrom(src => src.TarTitulo))
                .ForMember(dest => dest.Descripcion, opt => opt.MapFrom(src => src.TarDescripcion))
                .ForMember(dest => dest.Completada, opt => opt.MapFrom(src => src.TarCompletada))
                .ForMember(dest => dest.Prioridad, opt => opt.MapFrom(src => src.TarPrioridad))
                .ForMember(dest => dest.FechaVencimiento, opt => opt.MapFrom(src => src.TarFechaVencimiento))
                .ForMember(dest => dest.FechaCompletada, opt => opt.MapFrom(src => src.TarFechaCompletada))
                .ForMember(dest => dest.FechaCreacion, opt => opt.MapFrom(src => src.TarFechaCreacion))
                .ForMember(dest => dest.PrioridadTexto, opt => opt.MapFrom(src =>
                    src.TarPrioridad == 1 ? "Baja" :
                    src.TarPrioridad == 2 ? "Media" :
                    src.TarPrioridad == 3 ? "Alta" : "Urgente"))
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src =>
                    src.TarFechaVencimiento == null ? "Sin fecha" :
                    src.TarFechaVencimiento < DateTime.Now ? "Vencida" :
                    src.TarFechaVencimiento <= DateTime.Now.AddDays(1) ? "Urgente" :
                    src.TarFechaVencimiento <= DateTime.Now.AddDays(7) ? "Próxima" : "Normal"));

            // ====================================
            // MAPEOS DE CARPETAS
            // ====================================
            CreateMap<Carpeta, CarpetaDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CarId))
                .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => src.CarUsuarioId))
                .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.CarNombre))
                .ForMember(dest => dest.Descripcion, opt => opt.MapFrom(src => src.CarDescripcion))
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.CarColor))
                .ForMember(dest => dest.Icono, opt => opt.MapFrom(src => src.CarIcono))
                .ForMember(dest => dest.Orden, opt => opt.MapFrom(src => src.CarOrden))
                .ForMember(dest => dest.FechaCreacion, opt => opt.MapFrom(src => src.CarFechaCreacion))
                .ForMember(dest => dest.CantidadNotas, opt => opt.Ignore());

            CreateMap<CrearCarpetaDto, Carpeta>()
                .ForMember(dest => dest.CarNombre, opt => opt.MapFrom(src => src.Nombre))
                .ForMember(dest => dest.CarDescripcion, opt => opt.MapFrom(src => src.Descripcion))
                .ForMember(dest => dest.CarColor, opt => opt.MapFrom(src => src.Color))
                .ForMember(dest => dest.CarIcono, opt => opt.MapFrom(src => src.Icono))
                .ForMember(dest => dest.CarId, opt => opt.Ignore())
                .ForMember(dest => dest.CarUsuarioId, opt => opt.Ignore())
                .ForMember(dest => dest.CarOrden, opt => opt.Ignore())
                .ForMember(dest => dest.CarEliminado, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.CarFechaCreacion, opt => opt.Ignore())
                .ForMember(dest => dest.CarFechaActualizacion, opt => opt.Ignore());

            // ====================================
            // MAPEOS DE DIARIO
            // ====================================
            CreateMap<EntradasDiario, DiarioDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.DiaId))
                .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => src.DiaUsuarioId))
                .ForMember(dest => dest.FechaEntrada, opt => opt.MapFrom(src => src.DiaFechaEntrada))
                .ForMember(dest => dest.Titulo, opt => opt.MapFrom(src => src.DiaTitulo))
                .ForMember(dest => dest.Contenido, opt => opt.MapFrom(src => src.DiaContenido))
                .ForMember(dest => dest.EstadoAnimo, opt => opt.MapFrom(src => src.DiaEstadoAnimo))
                .ForMember(dest => dest.FechaCreacion, opt => opt.MapFrom(src => src.DiaFechaCreacion))
                .ForMember(dest => dest.FechaActualizacion, opt => opt.MapFrom(src => src.DiaFechaActualizacion))
                .ForMember(dest => dest.EstadoAnimoTexto, opt => opt.MapFrom(src =>
                    src.DiaEstadoAnimo == 1 ? "Muy mal" :
                    src.DiaEstadoAnimo == 2 ? "Mal" :
                    src.DiaEstadoAnimo == 3 ? "Regular" :
                    src.DiaEstadoAnimo == 4 ? "Bien" :
                    src.DiaEstadoAnimo == 5 ? "Excelente" : "No especificado"))
                .ForMember(dest => dest.RequierePin, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.DiaPinHash)));
        }
    }
}
