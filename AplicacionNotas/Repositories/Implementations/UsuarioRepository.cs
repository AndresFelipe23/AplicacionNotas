using AplicacionNotas.Data;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using Dapper;
using Microsoft.AspNetCore.Connections;
using System.Data;
using AplicacionNotas.Helpers;

namespace AplicacionNotas.Repositories.Implementations
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        private readonly IPasswordHelper _passwordHelper;

        public UsuarioRepository(IDbConnectionFactory connectionFactory, IPasswordHelper passwordHelper)
        {
            _connectionFactory = connectionFactory;
            _passwordHelper = passwordHelper;
        }

        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT 
                    USU_Id as UsuId, 
                    USU_Email as UsuEmail, 
                    USU_PasswordHash as UsuPasswordHash, 
                    USU_Nombre as UsuNombre, 
                    USU_Apellido as UsuApellido, 
                    USU_FechaCreacion as UsuFechaCreacion, 
                    USU_FechaActualizacion as UsuFechaActualizacion, 
                    USU_Activo as UsuActivo, 
                    USU_UltimoLogin as UsuUltimoLogin
                FROM Usuarios 
                WHERE USU_Email = @Email AND USU_Activo = 1";

            return await connection.QueryFirstOrDefaultAsync<Usuario>(sql, new { Email = email });
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                SELECT 
                    USU_Id as UsuId, 
                    USU_Email as UsuEmail, 
                    USU_PasswordHash as UsuPasswordHash, 
                    USU_Nombre as UsuNombre, 
                    USU_Apellido as UsuApellido, 
                    USU_FechaCreacion as UsuFechaCreacion, 
                    USU_FechaActualizacion as UsuFechaActualizacion, 
                    USU_Activo as UsuActivo, 
                    USU_UltimoLogin as UsuUltimoLogin
                FROM Usuarios 
                WHERE USU_Id = @Id AND USU_Activo = 1";

            var usuario = await connection.QueryFirstOrDefaultAsync<Usuario>(sql, new { Id = id });
            
            // Log para debugging
            if (usuario != null && string.IsNullOrEmpty(usuario.UsuEmail))
            {
                throw new InvalidOperationException($"Usuario con ID {id} encontrado pero sin email");
            }
            
            return usuario;
        }

        public async Task<int> CreateAsync(string email, string passwordHash, string? nombre, string? apellido)
        {
            using var connection = _connectionFactory.CreateConnection();

            var parameters = new DynamicParameters();
            parameters.Add("Email", email);
            parameters.Add("PasswordHash", passwordHash);
            parameters.Add("Nombre", nombre);
            parameters.Add("Apellido", apellido);

            var result = await connection.QueryFirstAsync<dynamic>(
                "sp_CrearUsuario",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.UsuarioId;
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = "SELECT COUNT(1) FROM Usuarios WHERE USU_Email = @Email";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Email = email });
            return count > 0;
        }

        public async Task UpdateLastLoginAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = @"
                UPDATE Usuarios 
                SET USU_UltimoLogin = GETDATE() 
                WHERE USU_Id = @UserId";

            await connection.ExecuteAsync(sql, new { UserId = userId });
        }

        public async Task<bool> ActualizarPinDiarioAsync(int usuarioId, string pinHash)
        {
            using var connection = _connectionFactory.CreateConnection();
            var filas = await connection.ExecuteAsync(
                "sp_ActualizarPinDiario",
                new { UsuarioId = usuarioId, PinHash = pinHash },
                commandType: CommandType.StoredProcedure
            );
            return filas > 0;
        }

        public async Task<bool> VerificarPinDiarioAsync(int usuarioId, string pin)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "SELECT USU_DiarioPinHash FROM Usuarios WHERE USU_Id = @UsuarioId";
            var hashAlmacenado = await connection.QueryFirstOrDefaultAsync<string>(sql, new { UsuarioId = usuarioId });
            if (string.IsNullOrEmpty(hashAlmacenado))
                return false;
            return _passwordHelper.VerifyPin(pin, hashAlmacenado);
        }

        public async Task<bool> TienePinDiarioAsync(int usuarioId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var tienePin = await connection.QueryFirstAsync<int>(
                "sp_TienePinDiario",
                new { UsuarioId = usuarioId },
                commandType: CommandType.StoredProcedure
            );
            return tienePin == 1;
        }
    }
}
