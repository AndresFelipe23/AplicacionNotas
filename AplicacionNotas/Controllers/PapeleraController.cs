using AplicacionNotas.Models.DTOs.Papelera;
using AplicacionNotas.Services.Implementations;
using AplicacionNotas.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AplicacionNotas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PapeleraController : ControllerBase
    {
        private readonly IPapeleraService _papeleraService;

        public PapeleraController(IPapeleraService papeleraService)
        {
            _papeleraService = papeleraService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPapelera()
        {
            try
            {
                var usuarioId = User.GetUserId();
                var elementos = await _papeleraService.GetElementosAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    data = elementos
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al obtener la papelera",
                    error = ex.Message
                });
            }
        }

        [HttpPost("{tipo}/{id}/restaurar")]
        public async Task<IActionResult> RestaurarElemento(string tipo, int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                var resultado = await _papeleraService.RestaurarElementoAsync(tipo, id, usuarioId);

                if (resultado)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Elemento restaurado exitosamente"
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "No se pudo restaurar el elemento"
                    });
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al restaurar el elemento",
                    error = ex.Message
                });
            }
        }

        [HttpDelete("{tipo}/{id}/permanente")]
        public async Task<IActionResult> EliminarPermanente(string tipo, int id)
        {
            try
            {
                var usuarioId = User.GetUserId();
                var resultado = await _papeleraService.EliminarPermanenteAsync(tipo, id, usuarioId);

                if (resultado)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Elemento eliminado permanentemente"
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "No se pudo eliminar el elemento"
                    });
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al eliminar el elemento",
                    error = ex.Message
                });
            }
        }

        [HttpDelete("vaciar")]
        public async Task<IActionResult> VaciarPapelera()
        {
            try
            {
                var usuarioId = User.GetUserId();
                var resultado = await _papeleraService.VaciarPapeleraAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    message = "Papelera vaciada exitosamente",
                    data = resultado
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al vaciar la papelera",
                    error = ex.Message
                });
            }
        }

        [HttpGet("contador")]
        public async Task<IActionResult> GetContadorPapelera()
        {
            try
            {
                var usuarioId = User.GetUserId();
                var contador = await _papeleraService.GetContadorPapeleraAsync(usuarioId);

                return Ok(new
                {
                    success = true,
                    data = new { contador }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al obtener el contador de papelera",
                    error = ex.Message
                });
            }
        }
    }
} 