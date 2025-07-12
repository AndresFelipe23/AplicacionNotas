using FluentValidation;
using AplicacionNotas.Models.DTOs.Diario;

namespace AplicacionNotas.Validators.Diario
{
    public class VerificarPinDiarioValidator : AbstractValidator<VerificarPinDiarioDto>
    {
        public VerificarPinDiarioValidator()
        {
            RuleFor(x => x.Pin)
                .NotEmpty().WithMessage("El PIN es obligatorio")
                .Length(4, 10).WithMessage("El PIN debe tener entre 4 y 10 caracteres");
        }
    }
} 