using AplicacionNotas.Models.DTOs.Notas;
using FluentValidation;

namespace AplicacionNotas.Validators.Notas
{
    public class MoverNotaValidator : AbstractValidator<MoverNotaDto>
    {
        public MoverNotaValidator()
        {
            RuleFor(x => x.NuevaCarpetaId)
                .GreaterThan(0).WithMessage("El ID de la nueva carpeta debe ser mayor a 0")
                .When(x => x.NuevaCarpetaId.HasValue);
        }
    }
} 