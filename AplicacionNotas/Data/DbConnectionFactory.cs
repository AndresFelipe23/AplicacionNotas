using Microsoft.Data.SqlClient;

namespace AplicacionNotas.Data
{
    /// <summary>
    /// Implementación del factory para crear conexiones a SQL Server
    /// </summary>
    public class DbConnectionFactory : IDbConnectionFactory
    {
        private readonly string _connectionString;
        private readonly ILogger<DbConnectionFactory> _logger;

        public DbConnectionFactory(IConfiguration configuration, ILogger<DbConnectionFactory> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration), "Connection string 'DefaultConnection' no encontrada");
            _logger = logger;
        }

        /// <summary>
        /// Crea una nueva conexión SQL Server (no abierta)
        /// </summary>
        /// <returns>SqlConnection configurada</returns>
        public SqlConnection CreateConnection()
        {
            try
            {
                var connection = new SqlConnection(_connectionString);
                _logger.LogDebug("Conexión SQL Server creada exitosamente");
                return connection;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear conexión SQL Server");
                throw;
            }
        }

        /// <summary>
        /// Crea una nueva conexión SQL Server y la abre
        /// </summary>
        /// <returns>SqlConnection abierta</returns>
        public async Task<SqlConnection> CreateOpenConnectionAsync()
        {
            try
            {
                var connection = CreateConnection();
                await connection.OpenAsync();
                _logger.LogDebug("Conexión SQL Server abierta exitosamente");
                return connection;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al abrir conexión SQL Server");
                throw;
            }
        }
    }
}
