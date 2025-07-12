using Microsoft.Data.SqlClient;

namespace AplicacionNotas.Data
{
    public interface IDbConnectionFactory
    {
        /// <summary>
        /// Crea una nueva conexión a SQL Server
        /// </summary>
        /// <returns>SqlConnection configurada pero no abierta</returns>
        SqlConnection CreateConnection();

        /// <summary>
        /// Crea una nueva conexión a SQL Server y la abre
        /// </summary>
        /// <returns>SqlConnection abierta y lista para usar</returns>
        Task<SqlConnection> CreateOpenConnectionAsync();
    }
}
