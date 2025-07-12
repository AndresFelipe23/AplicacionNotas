using AplicacionNotas.Models.DTOs.ConfiguracionUsuario;
using AplicacionNotas.Models.Entities;
using AplicacionNotas.Repositories.Interfaces;
using AplicacionNotas.Services.Interfaces;

namespace AplicacionNotas.Services.Implementations
{
    public class ConfiguracionUsuarioService : IConfiguracionUsuarioService
    {
        private readonly IConfiguracionUsuarioRepository _configuracionRepository;

        public ConfiguracionUsuarioService(IConfiguracionUsuarioRepository configuracionRepository)
        {
            _configuracionRepository = configuracionRepository;
        }

        public async Task<ConfiguracionUsuarioDto> GetConfiguracionAsync(int usuarioId)
        {
            var configuracion = await _configuracionRepository.GetByUsuarioIdAsync(usuarioId);
            
            if (configuracion == null)
            {
                // Si no existe configuración, crear una con valores por defecto
                var configuracionPorDefecto = new ConfiguracionUsuario
                {
                    ConUsuarioId = usuarioId,
                    ConTema = "auto",
                    ConIdioma = "es",
                    ConFormatoFecha = "dd/MM/yyyy",
                    ConDiarioPinRequerido = true,
                    ConNotificacionesActivadas = true,
                    ConFechaCreacion = DateTime.UtcNow,
                    ConFechaActualizacion = DateTime.UtcNow
                };

                await _configuracionRepository.CreateAsync(configuracionPorDefecto, usuarioId);
                
                return new ConfiguracionUsuarioDto
                {
                    Id = 0, // Se asignará después de la creación
                    UsuarioId = usuarioId,
                    Tema = configuracionPorDefecto.ConTema,
                    Idioma = configuracionPorDefecto.ConIdioma,
                    FormatoFecha = configuracionPorDefecto.ConFormatoFecha,
                    DiarioPinRequerido = configuracionPorDefecto.ConDiarioPinRequerido,
                    NotificacionesActivadas = configuracionPorDefecto.ConNotificacionesActivadas,
                    FechaCreacion = configuracionPorDefecto.ConFechaCreacion,
                    FechaActualizacion = configuracionPorDefecto.ConFechaActualizacion
                };
            }

            return configuracion;
        }

        public async Task<ConfiguracionUsuarioDto> UpdateConfiguracionAsync(ActualizarConfiguracionUsuarioDto request, int usuarioId)
        {
            var configuracionExistente = await _configuracionRepository.GetByUsuarioIdAsync(usuarioId);
            
            if (configuracionExistente == null)
            {
                // Si no existe configuración, crear una nueva
                var nuevaConfiguracion = new ConfiguracionUsuario
                {
                    ConUsuarioId = usuarioId,
                    ConTema = request.Tema ?? "auto",
                    ConIdioma = request.Idioma ?? "es",
                    ConFormatoFecha = request.FormatoFecha ?? "dd/MM/yyyy",
                    ConDiarioPinRequerido = request.DiarioPinRequerido ?? true,
                    ConNotificacionesActivadas = request.NotificacionesActivadas ?? true,
                    ConFechaCreacion = DateTime.UtcNow,
                    ConFechaActualizacion = DateTime.UtcNow
                };

                await _configuracionRepository.CreateAsync(nuevaConfiguracion, usuarioId);
                
                return await _configuracionRepository.GetByUsuarioIdAsync(usuarioId) ?? 
                    throw new InvalidOperationException("Error al crear la configuración");
            }

            // Actualizar configuración existente
            var configuracionActualizada = new ConfiguracionUsuario
            {
                ConUsuarioId = usuarioId,
                ConTema = request.Tema ?? configuracionExistente.Tema,
                ConIdioma = request.Idioma ?? configuracionExistente.Idioma,
                ConFormatoFecha = request.FormatoFecha ?? configuracionExistente.FormatoFecha,
                ConDiarioPinRequerido = request.DiarioPinRequerido ?? configuracionExistente.DiarioPinRequerido,
                ConNotificacionesActivadas = request.NotificacionesActivadas ?? configuracionExistente.NotificacionesActivadas
            };

            var actualizada = await _configuracionRepository.UpdateAsync(configuracionActualizada, usuarioId);
            if (!actualizada)
            {
                throw new InvalidOperationException("Error al actualizar la configuración");
            }

            return await _configuracionRepository.GetByUsuarioIdAsync(usuarioId) ?? 
                throw new InvalidOperationException("Error al obtener la configuración actualizada");
        }

        public async Task<ConfiguracionUsuarioDto> ResetConfiguracionAsync(int usuarioId)
        {
            var configuracionPorDefecto = new ConfiguracionUsuario
            {
                ConUsuarioId = usuarioId,
                ConTema = "auto",
                ConIdioma = "es",
                ConFormatoFecha = "dd/MM/yyyy",
                ConDiarioPinRequerido = true,
                ConNotificacionesActivadas = true
            };

            var existe = await _configuracionRepository.ExistsAsync(usuarioId);
            
            if (existe)
            {
                // Actualizar configuración existente
                var actualizada = await _configuracionRepository.UpdateAsync(configuracionPorDefecto, usuarioId);
                if (!actualizada)
                {
                    throw new InvalidOperationException("Error al restablecer la configuración");
                }
            }
            else
            {
                // Crear nueva configuración
                configuracionPorDefecto.ConFechaCreacion = DateTime.UtcNow;
                configuracionPorDefecto.ConFechaActualizacion = DateTime.UtcNow;
                await _configuracionRepository.CreateAsync(configuracionPorDefecto, usuarioId);
            }

            return await _configuracionRepository.GetByUsuarioIdAsync(usuarioId) ?? 
                throw new InvalidOperationException("Error al obtener la configuración restablecida");
        }
    }
} 