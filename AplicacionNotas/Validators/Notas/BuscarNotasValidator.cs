using AplicacionNotas.Models.DTOs.Notas;
using FluentValidation;

namespace AplicacionNotas.Validators.Notas
{
    public class BuscarNotasValidator : AbstractValidator<BuscarNotasDto>
    {
        public BuscarNotasValidator()
        {
            RuleFor(x => x.Termino)
                .MaximumLength(255).WithMessage("El término de búsqueda no puede exceder 255 caracteres")
                .When(x => !string.IsNullOrEmpty(x.Termino));

            RuleFor(x => x.CarpetaId)
                .GreaterThan(0).WithMessage("El ID de carpeta debe ser mayor a 0")
                .When(x => x.CarpetaId.HasValue);

            RuleFor(x => x.Etiquetas)
                .Must(etiquetas => etiquetas == null || etiquetas.All(e => !string.IsNullOrWhiteSpace(e)))
                .WithMessage("Las etiquetas no pueden estar vacías")
                .When(x => x.Etiquetas != null && x.Etiquetas.Any());

            RuleFor(x => x.FechaDesde)
                .LessThanOrEqualTo(x => x.FechaHasta)
                .WithMessage("La fecha desde debe ser menor o igual a la fecha hasta")
                .When(x => x.FechaDesde.HasValue && x.FechaHasta.HasValue);

            RuleFor(x => x.Pagina)
                .GreaterThan(0).WithMessage("La página debe ser mayor a 0");

            RuleFor(x => x.TamanoPagina)
                .InclusiveBetween(1, 100).WithMessage("El tamaño de página debe estar entre 1 y 100");
        }
    }
} 