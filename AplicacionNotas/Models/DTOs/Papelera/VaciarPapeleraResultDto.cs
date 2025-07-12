namespace AplicacionNotas.Models.DTOs.Papelera
{
    public class VaciarPapeleraResultDto
    {
        /// <summary>
        /// Cantidad de notas eliminadas permanentemente
        /// </summary>
        public int NotasEliminadas { get; set; }

        /// <summary>
        /// Cantidad de tareas eliminadas permanentemente
        /// </summary>
        public int TareasEliminadas { get; set; }

        /// <summary>
        /// Cantidad de carpetas eliminadas permanentemente
        /// </summary>
        public int CarpetasEliminadas { get; set; }

        /// <summary>
        /// Cantidad de entradas de diario eliminadas permanentemente
        /// </summary>
        public int DiarioEliminado { get; set; }

        /// <summary>
        /// Total de elementos eliminados
        /// </summary>
        public int TotalEliminado { get; set; }

        /// <summary>
        /// Mensaje descriptivo del resultado
        /// </summary>
        public string MensajeResultado
        {
            get
            {
                if (TotalEliminado == 0)
                    return "No había elementos para eliminar";

                var partes = new List<string>();

                if (NotasEliminadas > 0) partes.Add($"{NotasEliminadas} nota{(NotasEliminadas == 1 ? "" : "s")}");
                if (TareasEliminadas > 0) partes.Add($"{TareasEliminadas} tarea{(TareasEliminadas == 1 ? "" : "s")}");
                if (CarpetasEliminadas > 0) partes.Add($"{CarpetasEliminadas} carpeta{(CarpetasEliminadas == 1 ? "" : "s")}");
                if (DiarioEliminado > 0) partes.Add($"{DiarioEliminado} entrada{(DiarioEliminado == 1 ? "" : "s")} de diario");

                return $"Se eliminaron permanentemente: {string.Join(", ", partes)}";
            }
        }
    }
}
