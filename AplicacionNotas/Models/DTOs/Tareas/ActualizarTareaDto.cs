using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Tareas
{
    /// <summary>
    /// Datos para actualizar una tarea existente
    /// </summary>
    public class ActualizarTareaDto
    {
        /// <summary>
        /// Nuevo título de la tarea
        /// </summary>
        [Required(ErrorMessage = "El título es requerido")]
        [StringLength(500, ErrorMessage = "El título no puede exceder 500 caracteres")]
        [MinLength(1, ErrorMessage = "El título debe tener al menos 1 caracter")]
        public string Titulo { get; set; } = string.Empty;

        /// <summary>
        /// Nueva descripción de la tarea
        /// </summary>
        [StringLength(2000, ErrorMessage = "La descripción no puede exceder 2,000 caracteres")]
        public string? Descripcion { get; set; }

        /// <summary>
        /// Nueva prioridad de la tarea
        /// </summary>
        [Range(1, 4, ErrorMessage = "La prioridad debe estar entre 1 (Baja) y 4 (Urgente)")]
        public int Prioridad { get; set; } = 1;

        /// <summary>
        /// Nueva fecha de vencimiento
        /// </summary>
        public DateTime? FechaVencimiento { get; set; }

        /// <summary>
        /// Nuevo estado de la tarea para el flujo Kanban
        /// </summary>
        [StringLength(50, ErrorMessage = "El estado no puede exceder 50 caracteres")]
        public string? Estado { get; set; }
    }
} 