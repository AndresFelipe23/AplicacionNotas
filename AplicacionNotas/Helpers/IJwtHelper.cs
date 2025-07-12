namespace AplicacionNotas.Helpers
{
    public interface IJwtHelper
    {
        string GenerateToken(int userId, string email);
        int? ValidateToken(string token);
    }
}
