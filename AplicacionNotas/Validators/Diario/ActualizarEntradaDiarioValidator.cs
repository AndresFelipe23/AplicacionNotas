using FluentValidation;
using AplicacionNotas.Models.DTOs.Diario;

namespace AplicacionNotas.Validators.Diario
{
    public class ActualizarEntradaDiarioValidator : AbstractValidator<ActualizarEntradaDiarioDto>
    {
        public ActualizarEntradaDiarioValidator()
        {
            // Puedes agregar validaciones para Titulo, Contenido, EstadoAnimo si lo deseas
        }
    }
} 