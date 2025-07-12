namespace AplicacionNotas.Models.DTOs.Tareas
{

        /// <summary>
        /// Información completa de una tarea
        /// </summary>
        public class TareaDto
        {
            /// <summary>
            /// ID único de la tarea
            /// </summary>
            public int Id { get; set; }

            /// <summary>
            /// ID del usuario propietario
            /// </summary>
            public int UsuarioId { get; set; }

            /// <summary>
            /// Título de la tarea
            /// </summary>
            public string Titulo { get; set; } = string.Empty;

            /// <summary>
            /// Descripción opcional de la tarea
            /// </summary>
            public string? Descripcion { get; set; }

            /// <summary>
            /// Indica si la tarea está completada
            /// </summary>
            public bool Completada { get; set; }

            /// <summary>
            /// Nivel de prioridad (1=Baja, 2=Media, 3=Alta, 4=Urgente)
            /// </summary>
            public int Prioridad { get; set; }

            /// <summary>
            /// Descripción textual de la prioridad
            /// </summary>
            public string PrioridadTexto { get; set; } = string.Empty;

            /// <summary>
            /// Fecha límite para completar la tarea
            /// </summary>
            public DateTime? FechaVencimiento { get; set; }

            /// <summary>
            /// Fecha y hora cuando se completó la tarea
            /// </summary>
            public DateTime? FechaCompletada { get; set; }

            /// <summary>
            /// Fecha de creación de la tarea
            /// </summary>
            public DateTime FechaCreacion { get; set; }

            /// <summary>
            /// Estado de la tarea basado en fecha de vencimiento
            /// </summary>
            public string Estado { get; set; } = string.Empty;

            // ====================================
            // PROPIEDADES CALCULADAS
            // ====================================

            /// <summary>
            /// Indica si la tarea tiene descripción
            /// </summary>
            public bool TieneDescripcion => !string.IsNullOrWhiteSpace(Descripcion);

            /// <summary>
            /// Indica si la tarea tiene fecha de vencimiento
            /// </summary>
            public bool TieneFechaVencimiento => FechaVencimiento.HasValue;

            /// <summary>
            /// Color asociado a la prioridad de la tarea
            /// </summary>
            public string ColorPrioridad => Prioridad switch
            {
                1 => "#10B981", // Verde (Baja)
                2 => "#F59E0B", // Amarillo (Media)
                3 => "#F97316", // Naranja (Alta)
                4 => "#EF4444", // Rojo (Urgente)
                _ => "#6B7280"  // Gris (Sin prioridad)
            };

            /// <summary>
            /// Color asociado al estado de la tarea
            /// </summary>
            public string ColorEstado => Estado.ToLower() switch
            {
                "completada" => "#10B981", // Verde
                "vencida" => "#EF4444",    // Rojo
                "urgente" => "#F97316",    // Naranja
                "próxima" => "#F59E0B",    // Amarillo
                "normal" => "#3B82F6",     // Azul
                _ => "#6B7280"             // Gris
            };

            /// <summary>
            /// Emoji asociado a la prioridad
            /// </summary>
            public string EmojiPrioridad => Prioridad switch
            {
                1 => "🟢", // Baja
                2 => "🟡", // Media
                3 => "🟠", // Alta
                4 => "🔴", // Urgente
                _ => "⚪"  // Sin prioridad
            };

            /// <summary>
            /// Emoji asociado al estado
            /// </summary>
            public string EmojiEstado => Estado.ToLower() switch
            {
                "completada" => "✅",
                "vencida" => "❌",
                "urgente" => "⚠️",
                "próxima" => "⏰",
                "normal" => "📝",
                _ => "❓"
            };

            /// <summary>
            /// Días restantes hasta el vencimiento (negativo si está vencida)
            /// </summary>
            public int? DiasRestantes
            {
                get
                {
                    if (!FechaVencimiento.HasValue)
                        return null;

                    return (int)(FechaVencimiento.Value.Date - DateTime.Today).TotalDays;
                }
            }

            /// <summary>
            /// Texto descriptivo del tiempo restante
            /// </summary>
            public string TiempoRestante
            {
                get
                {
                    if (!FechaVencimiento.HasValue)
                        return "Sin fecha límite";

                    if (Completada)
                        return "Completada";

                    var dias = DiasRestantes ?? 0;

                    if (dias < 0)
                        return $"Vencida hace {Math.Abs(dias)} día{(Math.Abs(dias) == 1 ? "" : "s")}";
                    if (dias == 0)
                        return "Vence hoy";
                    if (dias == 1)
                        return "Vence mañana";
                    if (dias <= 7)
                        return $"Vence en {dias} día{(dias == 1 ? "" : "s")}";
                    if (dias <= 30)
                        return $"Vence en {(int)(dias / 7)} semana{((int)(dias / 7) == 1 ? "" : "s")}";

                    return $"Vence en {(int)(dias / 30)} mes{((int)(dias / 30) == 1 ? "" : "es")}";
                }
            }

            /// <summary>
            /// Indica si la tarea está vencida
            /// </summary>
            public bool EstaVencida => !Completada && FechaVencimiento.HasValue && FechaVencimiento.Value.Date < DateTime.Today;

            /// <summary>
            /// Indica si la tarea vence hoy
            /// </summary>
            public bool VenceHoy => !Completada && FechaVencimiento.HasValue && FechaVencimiento.Value.Date == DateTime.Today;

            /// <summary>
            /// Indica si la tarea vence mañana
            /// </summary>
            public bool VenceManana => !Completada && FechaVencimiento.HasValue && FechaVencimiento.Value.Date == DateTime.Today.AddDays(1);

            /// <summary>
            /// Indica si la tarea es de alta prioridad (Alta o Urgente)
            /// </summary>
            public bool EsAltaPrioridad => Prioridad >= 3;

            /// <summary>
            /// Tiempo que estuvo pendiente (desde creación hasta completada)
            /// </summary>
            public string TiempoPendiente
            {
                get
                {
                    if (!Completada)
                        return "Aún pendiente";

                    if (!FechaCompletada.HasValue)
                        return "Completada";

                    var diferencia = FechaCompletada.Value - FechaCreacion;

                    if (diferencia.TotalMinutes < 60)
                        return $"Completada en {(int)diferencia.TotalMinutes} minuto{((int)diferencia.TotalMinutes == 1 ? "" : "s")}";
                    if (diferencia.TotalHours < 24)
                        return $"Completada en {(int)diferencia.TotalHours} hora{((int)diferencia.TotalHours == 1 ? "" : "s")}";
                    if (diferencia.TotalDays < 30)
                        return $"Completada en {(int)diferencia.TotalDays} día{((int)diferencia.TotalDays == 1 ? "" : "s")}";

                    return $"Completada en {(int)(diferencia.TotalDays / 30)} mes{((int)(diferencia.TotalDays / 30) == 1 ? "" : "es")}";
                }
            }

            /// <summary>
            /// Vista previa de la descripción (primeros 100 caracteres)
            /// </summary>
            public string DescripcionPrevia
            {
                get
                {
                    if (string.IsNullOrWhiteSpace(Descripcion))
                        return "Sin descripción";

                    return Descripcion.Length <= 100
                        ? Descripcion
                        : Descripcion.Substring(0, 100) + "...";
                }
            }

            /// <summary>
            /// CSS class para el estado de la tarea
            /// </summary>
            public string CssClass => $"tarea-{Estado.ToLower().Replace("ó", "o")} prioridad-{Prioridad}";

            /// <summary>
            /// Progreso de la tarea (0-100%)
            /// </summary>
            public int Progreso => Completada ? 100 : 0;
        }
    }
