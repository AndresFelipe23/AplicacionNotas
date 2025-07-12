namespace AplicacionNotas.Helpers
{
    public class PasswordHelper : IPasswordHelper
    {
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, 12);
        }

        public bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        public string HashPin(string pin)
        {
            return BCrypt.Net.BCrypt.HashPassword(pin, 12);
        }

        public bool VerifyPin(string pin, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(pin, hash);
        }
    }
}
