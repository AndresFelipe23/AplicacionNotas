using AplicacionNotas.Models.DTOs.ConfiguracionUsuario;
using FluentValidation;

namespace AplicacionNotas.Validators.ConfiguracionUsuario
{
    public class ActualizarConfiguracionUsuarioValidator : AbstractValidator<ActualizarConfiguracionUsuarioDto>
    {
        public ActualizarConfiguracionUsuarioValidator()
        {
            RuleFor(x => x.Tema)
                .Must(tema => tema == null || new[] { "light", "dark", "auto" }.Contains(tema))
                .WithMessage("El tema debe ser 'light', 'dark' o 'auto'")
                .When(x => !string.IsNullOrEmpty(x.Tema));

            RuleFor(x => x.Idioma)
                .Must(idioma => idioma == null || new[] { "es", "en", "fr", "pt" }.Contains(idioma))
                .WithMessage("El idioma debe ser 'es', 'en', 'fr' o 'pt'")
                .When(x => !string.IsNullOrEmpty(x.Idioma));

            RuleFor(x => x.FormatoFecha)
                .Must(formato => formato == null || new[] { 
                    "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd", "dd-MM-yyyy", "MM-dd-yyyy" 
                }.Contains(formato))
                .WithMessage("Formato de fecha no válido. Use: dd/MM/yyyy, MM/dd/yyyy, yyyy-MM-dd, dd-MM-yyyy o MM-dd-yyyy")
                .When(x => !string.IsNullOrEmpty(x.FormatoFecha));
        }
    }
} 