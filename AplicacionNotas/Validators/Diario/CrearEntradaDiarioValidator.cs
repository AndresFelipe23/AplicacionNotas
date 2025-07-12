using FluentValidation;
using AplicacionNotas.Models.DTOs.Diario;

namespace AplicacionNotas.Validators.Diario
{
    public class CrearEntradaDiarioValidator : AbstractValidator<CrearEntradaDiarioDto>
    {
        public CrearEntradaDiarioValidator()
        {
            RuleFor(x => x.FechaEntrada)
                .NotEmpty().WithMessage("La fecha de la entrada es obligatoria");
            // Puedes agregar más validaciones para Titulo, Contenido, EstadoAnimo si lo deseas
        }
    }
} 