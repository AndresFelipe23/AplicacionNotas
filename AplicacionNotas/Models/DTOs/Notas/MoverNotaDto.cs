using System.ComponentModel.DataAnnotations;

namespace AplicacionNotas.Models.DTOs.Notas
{
    public class MoverNotaDto
    {
        /// <summary>
        /// ID de la nueva carpeta (null para "Sin carpeta")
        /// </summary>
        public int? NuevaCarpetaId { get; set; }
    }

    
}
