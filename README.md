# Aplicación de Notas

Este es un proyecto Full-Stack de una aplicación de notas diseñada para ayudar a los usuarios a organizar sus ideas, tareas y pensamientos de manera eficiente. La aplicación cuenta con un backend robusto construido con ASP.NET Core y un frontend moderno y reactivo desarrollado con React y TypeScript.

## Características Principales

- **Gestión Completa de Notas:** Crea, edita, visualiza y elimina notas.
- **Organización por Carpetas:** Agrupa tus notas en carpetas personalizadas para una mejor organización.
- **Gestión de Tareas:** Lleva un registro de tus tareas pendientes, márcalas como completadas y visualízalas en un tablero Kanban.
- **Diario Personal:** Un espacio privado y seguro para tus pensamientos y reflexiones diarias, protegido con un PIN.
- **Autenticación de Usuarios:** Sistema de registro e inicio de sesión seguro basado en JWT (JSON Web Tokens).
- **Papelera de Reciclaje:** Recupera notas, tareas o carpetas eliminadas accidentalmente.
- **Diseño Responsivo:** Interfaz de usuario amigable y adaptable a diferentes tamaños de pantalla gracias a Tailwind CSS.

## Stack Tecnológico

### Backend
- **Framework:** ASP.NET Core Web API (.NET 8)
- **Lenguaje:** C#
- **Base de Datos:** SQL Server
- **Autenticación:** JWT (JSON Web Tokens)

### Frontend
- **Librería:** React (con TypeScript)
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS
- **Componentes UI:** Componentes personalizados, con soporte para modales y notificaciones (SweetAlert).

## Estructura del Proyecto

El repositorio está organizado en dos carpetas principales:

- `AplicacionNotas/`: Contiene todo el código fuente del backend (API en ASP.NET Core).
  - `Controllers/`: Endpoints de la API.
  - `Services/`: Lógica de negocio.
  - `Repositories/`: Acceso a datos.
  - `Models/`: Entidades de la base de datos y DTOs.
- `AplicacionNotasWEB/`: Contiene todo el código fuente del frontend (SPA en React).
  - `src/pages/`: Componentes de página principales.
  - `src/components/`: Componentes reutilizables.
  - `src/services/`: Lógica para consumir la API del backend.

## Puesta en Marcha

Para ejecutar el proyecto en un entorno local, sigue estos pasos:

### Prerrequisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- Un servidor de SQL Server (como SQL Server Express).

### Configuración del Backend

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    cd AplicacionNotas
    ```
2.  **Configura la base de datos:**
    - Abre tu gestor de SQL Server.
    - Ejecuta los scripts `.sql` que se encuentran en la raíz del proyecto (`AplicacionNotas.sql`, `StoredProcedures_Kanban.sql`, etc.) para crear la base de datos, las tablas y los procedimientos almacenados.
3.  **Configura la cadena de conexión:**
    - Abre el archivo `AplicacionNotas/appsettings.json`.
    - Modifica la propiedad `DefaultConnection` en `ConnectionStrings` para que apunte a tu instancia de SQL Server.
4.  **Ejecuta el backend:**
    - Navega a la carpeta del backend: `cd AplicacionNotas`
    - Ejecuta el comando: `dotnet run`
    - La API estará disponible en la URL que indique la consola (generalmente `https://localhost:7xxx`).

### Configuración del Frontend

1.  **Navega a la carpeta del frontend:**
    ```bash
    cd AplicacionNotasWEB
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    ```
    *(Si usas `bun`, puedes ejecutar `bun install`)*.
3.  **Configura las variables de entorno:**
    - Crea un archivo `.env` en la raíz de `AplicacionNotasWEB/`.
    - Añade la URL de tu API de backend. Asegúrate de que coincida con la URL donde se está ejecutando tu backend.
    ```
    VITE_API_URL=https://localhost:7098/api
    ```
4.  **Ejecuta el frontend:**
    ```bash
    npm run dev
    ```
    - La aplicación web estará disponible en `http://localhost:5173`.
