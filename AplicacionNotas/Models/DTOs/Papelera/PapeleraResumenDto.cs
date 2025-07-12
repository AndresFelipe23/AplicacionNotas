namespace AplicacionNotas.Models.DTOs.Papelera
{
    public class PapeleraResumenDto
    {
        /// <summary>
        /// Total de elementos en papelera
        /// </summary>
        public int TotalElementos { get; set; }

        /// <summary>
        /// Cantidad de notas en papelera
        /// </summary>
        public int Notas { get; set; }

        /// <summary>
        /// Cantidad de tareas en papelera
        /// </summary>
        public int Tareas { get; set; }

        /// <summary>
        /// Cantidad de carpetas en papelera
        /// </summary>
        public int Carpetas { get; set; }

        /// <summary>
        /// Cantidad de entradas de diario en papelera
        /// </summary>
        public int Diario { get; set; }

        /// <summary>
        /// Fecha del elemento más antiguo en papelera
        /// </summary>
        public DateTime? FechaMasAntigua { get; set; }

        /// <summary>
        /// Fecha del elemento más reciente en papelera
        /// </summary>
        public DateTime? FechaMasReciente { get; set; }

        /// <summary>
        /// Indica si la papelera está vacía
        /// </summary>
        public bool EstaVacia => TotalElementos == 0;

        /// <summary>
        /// Mensaje descriptivo del contenido
        /// </summary>
        public string DescripcionContenido
        {
            get
            {
                if (EstaVacia)
                    return "La papelera está vacía";

                var partes = new List<string>();

                if (Notas > 0) partes.Add($"{Notas} nota{(Notas == 1 ? "" : "s")}");
                if (Tareas > 0) partes.Add($"{Tareas} tarea{(Tareas == 1 ? "" : "s")}");
                if (Carpetas > 0) partes.Add($"{Carpetas} carpeta{(Carpetas == 1 ? "" : "s")}");
                if (Diario > 0) partes.Add($"{Diario} entrada{(Diario == 1 ? "" : "s")} de diario");

                return string.Join(", ", partes);
            }
        }
    }
}
