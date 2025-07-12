using AplicacionNotas.Data;
using AplicacionNotas.Models.DTOs.ConfiguracionUsuario;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace AplicacionNotas.Repositories.Implementations
{
    public class ConfiguracionUsuarioRepository : IConfiguracionUsuarioRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public ConfiguracionUsuarioRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<ConfiguracionUsuarioDto?> GetByUsuarioIdAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT 
                    CON_Id as Id,
                    CON_UsuarioId as UsuarioId,
                    CON_Tema as Tema,
                    CON_Idioma as Idioma,
                    CON_FormatoFecha as FormatoFecha,
                    CON_DiarioPinRequerido as DiarioPinRequerido,
                    CON_NotificacionesActivadas as NotificacionesActivadas,
                    CON_FechaCreacion as FechaCreacion,
                    CON_FechaActualizacion as FechaActualizacion
                FROM ConfiguracionUsuario
                WHERE CON_UsuarioId = @UsuarioId";

            var parameters = new { UsuarioId = usuarioId };

            return await connection.QueryFirstOrDefaultAsync<ConfiguracionUsuarioDto>(sql, parameters);
        }

        public async Task<int> CreateAsync(ConfiguracionUsuario configuracion, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                INSERT INTO ConfiguracionUsuario (
                    CON_UsuarioId,
                    CON_Tema,
                    CON_Idioma,
                    CON_FormatoFecha,
                    CON_DiarioPinRequerido,
                    CON_NotificacionesActivadas,
                    CON_FechaCreacion,
                    CON_FechaActualizacion
                ) VALUES (
                    @UsuarioId,
                    @Tema,
                    @Idioma,
                    @FormatoFecha,
                    @DiarioPinRequerido,
                    @NotificacionesActivadas,
                    @FechaCreacion,
                    @FechaActualizacion
                );
                SELECT CAST(SCOPE_IDENTITY() as int)";

            var parameters = new
            {
                UsuarioId = usuarioId,
                Tema = configuracion.ConTema,
                Idioma = configuracion.ConIdioma,
                FormatoFecha = configuracion.ConFormatoFecha,
                DiarioPinRequerido = configuracion.ConDiarioPinRequerido,
                NotificacionesActivadas = configuracion.ConNotificacionesActivadas,
                FechaCreacion = configuracion.ConFechaCreacion ?? DateTime.UtcNow,
                FechaActualizacion = configuracion.ConFechaActualizacion ?? DateTime.UtcNow
            };

            return await connection.QuerySingleAsync<int>(sql, parameters);
        }

        public async Task<bool> UpdateAsync(ConfiguracionUsuario configuracion, int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                UPDATE ConfiguracionUsuario
                SET 
                    CON_Tema = @Tema,
                    CON_Idioma = @Idioma,
                    CON_FormatoFecha = @FormatoFecha,
                    CON_DiarioPinRequerido = @DiarioPinRequerido,
                    CON_NotificacionesActivadas = @NotificacionesActivadas,
                    CON_FechaActualizacion = @FechaActualizacion
                WHERE CON_UsuarioId = @UsuarioId";

            var parameters = new
            {
                UsuarioId = usuarioId,
                Tema = configuracion.ConTema,
                Idioma = configuracion.ConIdioma,
                FormatoFecha = configuracion.ConFormatoFecha,
                DiarioPinRequerido = configuracion.ConDiarioPinRequerido,
                NotificacionesActivadas = configuracion.ConNotificacionesActivadas,
                FechaActualizacion = DateTime.UtcNow
            };

            var rowsAffected = await connection.ExecuteAsync(sql, parameters);
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT COUNT(1)
                FROM ConfiguracionUsuario
                WHERE CON_UsuarioId = @UsuarioId";

            var parameters = new { UsuarioId = usuarioId };

            var count = await connection.QuerySingleAsync<int>(sql, parameters);
            return count > 0;
        }
    }
} 