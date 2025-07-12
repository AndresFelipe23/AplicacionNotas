using AplicacionNotas.Models.DTOs.Carpetas;
using FluentValidation;

namespace AplicacionNotas.Validators.Carpetas
{
    public class ReordenarCarpetaValidator : AbstractValidator<ReordenarCarpetaDto>
    {
        public ReordenarCarpetaValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("El ID de la carpeta debe ser mayor a 0");

            RuleFor(x => x.Orden)
                .GreaterThanOrEqualTo(0).WithMessage("El orden debe ser mayor o igual a 0");
        }
    }
} 