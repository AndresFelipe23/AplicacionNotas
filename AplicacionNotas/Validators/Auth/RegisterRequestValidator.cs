using AplicacionNotas.Models.DTOs.Auth;
using FluentValidation;

namespace AplicacionNotas.Validators.Auth
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequestDto>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("El email es requerido")
                .EmailAddress().WithMessage("El formato del email no es válido")
                .MaximumLength(255).WithMessage("El email no puede exceder 255 caracteres");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("La contraseña es requerida")
                .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres")
                .MaximumLength(100).WithMessage("La contraseña no puede exceder 100 caracteres")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$")
                .WithMessage("La contraseña debe contener al menos una minúscula, una mayúscula y un número");

            RuleFor(x => x.Nombre)
                .MaximumLength(100).WithMessage("El nombre no puede exceder 100 caracteres")
                .When(x => !string.IsNullOrEmpty(x.Nombre));

            RuleFor(x => x.Apellido)
                .MaximumLength(100).WithMessage("El apellido no puede exceder 100 caracteres")
                .When(x => !string.IsNullOrEmpty(x.Apellido));
        }
    }
}
