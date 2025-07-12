
using Microsoft.IdentityModel.Tokens;
using System.Text;

using FluentValidation;
using FluentValidation.AspNetCore;
using AutoMapper;
using AplicacionNotas.Helpers;
using AplicacionNotas.Repositories.Interfaces;
using AplicacionNotas.Repositories.Implementations;
using AplicacionNotas.Services.Implementations;
using AplicacionNotas.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;


var builder = WebApplication.CreateBuilder(args);

// ====================================
// CONFIGURACI�N DE SERVICIOS
// ====================================

// Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Notes App API",
        Version = "v1",
        Description = "API para aplicaci�n de notas con carpetas, tareas y diario"
    });

    // Configuraci�n JWT para Swagger
    c.AddSecurityDefinition("Bearer", new()
    {
        Description = "JWT Authorization header usando Bearer scheme. Ejemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new()
    {
        {
            new()
            {
                Reference = new()
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ====================================
// CONFIGURACI�N DE BASE DE DATOS
// ====================================

// Dapper Connection Factory
builder.Services.AddSingleton<IDbConnectionFactory, DbConnectionFactory>();

// ====================================
// CONFIGURACI�N JWT
// ====================================

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey no configurado");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ====================================
// CONFIGURACI�N CORS
// ====================================

var corsSettings = builder.Configuration.GetSection("Cors");
var allowedOrigins = corsSettings.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});

// ====================================
// AUTOMAPPER
// ====================================

builder.Services.AddAutoMapper(typeof(MappingProfile));

// ====================================
// FLUENT VALIDATION
// ====================================

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// ====================================
// INYECCI�N DE DEPENDENCIAS
// ====================================

// Repositorios
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<INotaRepository, NotaRepository>();
builder.Services.AddScoped<ITareaRepository, TareaRepository>();
builder.Services.AddScoped<ICarpetaRepository, CarpetaRepository>();
builder.Services.AddScoped<IDiarioRepository, DiarioRepository>();
builder.Services.AddScoped<IPapeleraRepository, PapeleraRepository>();

// Servicios
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<INotaService, NotaService>();
builder.Services.AddScoped<ITareaService, TareaService>();
builder.Services.AddScoped<ICarpetaService, CarpetaService>();
builder.Services.AddScoped<IDiarioService, DiarioService>();
builder.Services.AddScoped<IPapeleraService, PapeleraService>();

// Helpers
builder.Services.AddScoped<IJwtHelper, JwtHelper>();
builder.Services.AddScoped<IPasswordHelper, PasswordHelper>();

var app = builder.Build();

// ====================================
// CONFIGURACI�N DEL PIPELINE
// ====================================

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Notes App API v1");
        c.RoutePrefix = string.Empty; // Para que Swagger est� en la ra�z
    });
}

// MIDDLEWARE DE MANEJO DE ERRORES
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var error = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        if (error != null)
        {
            var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogError(error.Error, "Error no controlado");

            var response = new
            {
                success = false,
                message = app.Environment.IsDevelopment()
                    ? error.Error.Message
                    : "Ha ocurrido un error interno del servidor",
                errors = app.Environment.IsDevelopment()
                    ? new[] { error.Error.StackTrace }
                    : null
            };

            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
        }
    });
});

app.UseHttpsRedirection();

// CORS debe ir antes de Authentication
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();