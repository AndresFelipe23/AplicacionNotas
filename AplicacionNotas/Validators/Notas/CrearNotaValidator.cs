using AplicacionNotas.Models.DTOs.Notas;
using FluentValidation;

namespace AplicacionNotas.Validators.Notas
{
    public class CrearNotaValidator : AbstractValidator<CrearNotaDto>
    {
        public CrearNotaValidator()
        {
            RuleFor(x => x.Titulo)
                .NotEmpty().WithMessage("El título es requerido")
                .MaximumLength(500).WithMessage("El título no puede exceder 500 caracteres");

            RuleFor(x => x.Contenido)
                .MaximumLength(10000).WithMessage("El contenido no puede exceder 10,000 caracteres")
                .When(x => !string.IsNullOrEmpty(x.Contenido));

            RuleFor(x => x.Etiquetas)
                .Must(etiquetas => etiquetas == null || etiquetas.Count <= 10)
                .WithMessage("No se pueden agregar más de 10 etiquetas")
                .Must(etiquetas => etiquetas == null || etiquetas.All(e => e.Length <= 50))
                .WithMessage("Cada etiqueta no puede exceder 50 caracteres");
        }
    }
}
