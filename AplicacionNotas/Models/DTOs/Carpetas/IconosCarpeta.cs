namespace AplicacionNotas.Models.DTOs.Carpetas
{
    /// <summary>
    /// Iconos disponibles para carpetas
    /// </summary>
    public static class IconosCarpeta
    {
        public const string Carpeta = "carpeta";
        public const string Trabajo = "trabajo";
        public const string Personal = "personal";
        public const string Proyecto = "proyecto";
        public const string Estudio = "estudio";
        public const string Familia = "familia";
        public const string Viaje = "viaje";
        public const string Finanzas = "finanzas";
        public const string Salud = "salud";
        public const string Hogar = "hogar";
        public const string Compras = "compras";
        public const string Ideas = "ideas";

        public static readonly string[] TodosLosIconos = {
            Carpeta, Trabajo, Personal, Proyecto, Estudio, Familia,
            Viaje, Finanzas, Salud, Hogar, Compras, Ideas
        };
    }
}
