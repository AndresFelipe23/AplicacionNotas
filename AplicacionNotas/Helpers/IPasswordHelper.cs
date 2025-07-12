namespace AplicacionNotas.Helpers
{
    public interface IPasswordHelper
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
        string HashPin(string pin);
        bool VerifyPin(string pin, string hash);
    }
}
