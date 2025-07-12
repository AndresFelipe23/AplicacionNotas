using AplicacionNotas.Models.DTOs.Diario;
using FluentValidation;

namespace AplicacionNotas.Validators.Diario
{
    public class BuscarEntradasDiarioValidator : AbstractValidator<BuscarEntradasDiarioDto>
    {
        public BuscarEntradasDiarioValidator()
        {
            RuleFor(x => x.Termino)
                .NotEmpty().WithMessage("El término de búsqueda es requerido")
                .MinimumLength(2).WithMessage("El término de búsqueda debe tener al menos 2 caracteres")
                .MaximumLength(100).WithMessage("El término de búsqueda no puede exceder 100 caracteres");

            RuleFor(x => x.FechaInicio)
                .LessThanOrEqualTo(DateTime.Today).WithMessage("La fecha de inicio no puede ser futura")
                .When(x => x.FechaInicio.HasValue);

            RuleFor(x => x.FechaFin)
                .LessThanOrEqualTo(DateTime.Today).WithMessage("La fecha de fin no puede ser futura")
                .When(x => x.FechaFin.HasValue);

            RuleFor(x => x.FechaFin)
                .GreaterThanOrEqualTo(x => x.FechaInicio).WithMessage("La fecha de fin debe ser mayor o igual a la fecha de inicio")
                .When(x => x.FechaInicio.HasValue && x.FechaFin.HasValue);

            RuleFor(x => x.EstadoAnimo)
                .InclusiveBetween(1, 5).WithMessage("El estado de ánimo debe estar entre 1 (Muy mal) y 5 (Excelente)")
                .When(x => x.EstadoAnimo.HasValue);

            RuleFor(x => x.Pagina)
                .GreaterThan(0).WithMessage("El número de página debe ser mayor a 0");

            RuleFor(x => x.TamañoPagina)
                .InclusiveBetween(1, 100).WithMessage("El tamaño de página debe estar entre 1 y 100");

            RuleFor(x => x)
                .Must(x => !(x.SoloTitulos && x.SoloContenido))
                .WithMessage("No se puede buscar solo en títulos y solo en contenido al mismo tiempo");
        }
    }
} 