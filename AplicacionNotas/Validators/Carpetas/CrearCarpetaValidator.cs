using AplicacionNotas.Models.DTOs.Carpetas;
using FluentValidation;

namespace AplicacionNotas.Validators.Carpetas
{
    public class CrearCarpetaValidator : AbstractValidator<CrearCarpetaDto>
    {
        public CrearCarpetaValidator()
        {
            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es requerido")
                .MaximumLength(255).WithMessage("El nombre no puede exceder 255 caracteres");

            RuleFor(x => x.Descripcion)
                .MaximumLength(500).WithMessage("La descripción no puede exceder 500 caracteres")
                .When(x => !string.IsNullOrEmpty(x.Descripcion));

            RuleFor(x => x.Color)
                .NotEmpty().WithMessage("El color es requerido")
                .Matches("^#[0-9A-Fa-f]{6}$").WithMessage("El color debe tener formato hexadecimal válido (#RRGGBB)");

            RuleFor(x => x.Icono)
                .NotEmpty().WithMessage("El icono es requerido")
                .MaximumLength(50).WithMessage("El icono no puede exceder 50 caracteres");
        }
    }
}
