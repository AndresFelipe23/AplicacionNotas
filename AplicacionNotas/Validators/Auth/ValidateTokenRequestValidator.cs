using AplicacionNotas.Models.DTOs.Auth;
using FluentValidation;

namespace AplicacionNotas.Validators.Auth
{
    public class ValidateTokenRequestValidator : AbstractValidator<ValidateTokenRequestDto>
    {
        public ValidateTokenRequestValidator()
        {
            RuleFor(x => x.Token)
                .NotEmpty().WithMessage("El token es requerido")
                .MinimumLength(10).WithMessage("El token debe tener al menos 10 caracteres");
        }
    }
} 