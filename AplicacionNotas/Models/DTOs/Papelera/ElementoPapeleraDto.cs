namespace AplicacionNotas.Models.DTOs.Papelera
{
    public class ElementoPapeleraDto
    {
        /// <summary>
        /// Tipo de elemento (Nota, Tarea, Carpeta, Diario)
        /// </summary>
        public string Tipo { get; set; } = string.Empty;

        /// <summary>
        /// ID único del elemento
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Título o nombre del elemento
        /// </summary>
        public string Titulo { get; set; } = string.Empty;

        /// <summary>
        /// Fecha y hora cuando se envió a papelera
        /// </summary>
        public DateTime FechaEliminacion { get; set; }

        /// <summary>
        /// Nombre de la carpeta (solo para notas que pertenecían a una carpeta)
        /// </summary>
        public string? NombreCarpeta { get; set; }

        // ====================================
        // PROPIEDADES CALCULADAS
        // ====================================

        /// <summary>
        /// Indica el tipo de elemento con icono para UI
        /// </summary>
        public string TipoConIcono => Tipo.ToLower() switch
        {
            "nota" => "📝 Nota",
            "tarea" => "✅ Tarea",
            "carpeta" => "📁 Carpeta",
            "diario" => "📔 Diario",
            _ => "❓ Desconocido"
        };

        /// <summary>
        /// Color asociado al tipo de elemento
        /// </summary>
        public string ColorTipo => Tipo.ToLower() switch
        {
            "nota" => "#3B82F6",     // Azul
            "tarea" => "#10B981",    // Verde
            "carpeta" => "#F59E0B",  // Amarillo
            "diario" => "#8B5CF6",   // Morado
            _ => "#6B7280"           // Gris
        };

        /// <summary>
        /// Tiempo transcurrido desde que se eliminó
        /// </summary>
        public string TiempoEnPapelera
        {
            get
            {
                var diferencia = DateTime.UtcNow - FechaEliminacion;

                if (diferencia.TotalMinutes < 1)
                    return "Hace un momento";
                if (diferencia.TotalMinutes < 60)
                    return $"Hace {(int)diferencia.TotalMinutes} minuto{((int)diferencia.TotalMinutes == 1 ? "" : "s")}";
                if (diferencia.TotalHours < 24)
                    return $"Hace {(int)diferencia.TotalHours} hora{((int)diferencia.TotalHours == 1 ? "" : "s")}";
                if (diferencia.TotalDays < 30)
                    return $"Hace {(int)diferencia.TotalDays} día{((int)diferencia.TotalDays == 1 ? "" : "s")}";
                if (diferencia.TotalDays < 365)
                    return $"Hace {(int)(diferencia.TotalDays / 30)} mes{((int)(diferencia.TotalDays / 30) == 1 ? "" : "es")}";

                return $"Hace {(int)(diferencia.TotalDays / 365)} año{((int)(diferencia.TotalDays / 365) == 1 ? "" : "s")}";
            }
        }

        /// <summary>
        /// Descripción completa del elemento para mostrar en listas
        /// </summary>
        public string DescripcionCompleta
        {
            get
            {
                var descripcion = $"{TipoConIcono}: {Titulo}";

                if (!string.IsNullOrEmpty(NombreCarpeta))
                {
                    descripcion += $" (de carpeta: {NombreCarpeta})";
                }

                return descripcion;
            }
        }

        /// <summary>
        /// Indica si el elemento está próximo a ser eliminado automáticamente
        /// (si implementas auto-limpieza de papelera)
        /// </summary>
        public bool ProximoAEliminacion
        {
            get
            {
                // Ejemplo: elementos en papelera por más de 30 días
                var diasEnPapelera = (DateTime.UtcNow - FechaEliminacion).TotalDays;
                return diasEnPapelera > 30;
            }
        }

        /// <summary>
        /// CSS class para el elemento según su tipo
        /// </summary>
        public string CssClass => $"papelera-item papelera-{Tipo.ToLower()}";

        /// <summary>
        /// Determina si se puede restaurar este elemento
        /// </summary>
        public bool PuedeRestaurar => true; // Todos los elementos se pueden restaurar por defecto

        /// <summary>
        /// Mensaje de confirmación para eliminar permanentemente
        /// </summary>
        public string MensajeConfirmacionEliminacion => Tipo.ToLower() switch
        {
            "nota" => $"¿Estás seguro de eliminar permanentemente la nota '{Titulo}'? Esta acción no se puede deshacer.",
            "tarea" => $"¿Estás seguro de eliminar permanentemente la tarea '{Titulo}'? Esta acción no se puede deshacer.",
            "carpeta" => $"¿Estás seguro de eliminar permanentemente la carpeta '{Titulo}' y todas sus notas? Esta acción no se puede deshacer.",
            "diario" => $"¿Estás seguro de eliminar permanentemente la entrada de diario '{Titulo}'? Esta acción no se puede deshacer.",
            _ => $"¿Estás seguro de eliminar permanentemente este elemento? Esta acción no se puede deshacer."
        };
    }
}
