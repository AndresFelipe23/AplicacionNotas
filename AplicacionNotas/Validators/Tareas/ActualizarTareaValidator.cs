using AplicacionNotas.Models.DTOs.Tareas;
using FluentValidation;

namespace AplicacionNotas.Validators.Tareas
{
    public class ActualizarTareaValidator : AbstractValidator<ActualizarTareaDto>
    {
        public ActualizarTareaValidator()
        {
            RuleFor(x => x.Titulo)
                .NotEmpty().WithMessage("El título es requerido")
                .MaximumLength(500).WithMessage("El título no puede exceder 500 caracteres");

            RuleFor(x => x.Descripcion)
                .MaximumLength(2000).WithMessage("La descripción no puede exceder 2,000 caracteres")
                .When(x => !string.IsNullOrEmpty(x.Descripcion));

            RuleFor(x => x.Prioridad)
                .InclusiveBetween(1, 4).WithMessage("La prioridad debe estar entre 1 (Baja) y 4 (Urgente)");

            RuleFor(x => x.FechaVencimiento)
                .GreaterThan(DateTime.Today.AddDays(-1)).WithMessage("La fecha de vencimiento no puede ser anterior a hoy")
                .When(x => x.FechaVencimiento.HasValue);
        }
    }
} 