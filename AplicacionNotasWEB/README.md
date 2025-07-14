# NexusNote - Aplicación de Notas y Productividad

NexusNote es una aplicación web moderna y completa diseñada para ayudarte a capturar ideas, organizar tus pensamientos y transformar tu productividad. Ofrece un conjunto de herramientas integradas que van desde la toma de notas hasta la gestión de tareas y un diario personal seguro.

## Características Principales

La aplicación está dividida en varias secciones clave, cada una con funcionalidades específicas:

### 🏠 **Home**
- **Página de Bienvenida:** Saluda al usuario de forma personalizada según la hora del día.
- **Nota Rápida:** Permite capturar ideas al instante sin necesidad de navegar a otras secciones.
- **Diseño Motivador:** Interfaz limpia y con animaciones para una experiencia de usuario agradable.

### 📝 **Notas**
- **Editor Avanzado:** Un editor de texto enriquecido para crear notas detalladas.
- **Organización con Carpetas y Etiquetas:** Clasifica tus notas en carpetas y asígnales etiquetas para una búsqueda y filtrado eficientes.
- **Búsqueda Potente:** Encuentra notas rápidamente por título, contenido o etiqueta.
- **Favoritos:** Marca tus notas más importantes para un acceso rápido.

### ✅ **Tareas (Tablero Kanban)**
- **Gestión Visual:** Organiza tus tareas en un tablero Kanban con columnas para "Por hacer", "En progreso" y "Completadas".
- **Arrastrar y Soltar (Drag & Drop):** Mueve tareas entre columnas para actualizar su estado de forma intuitiva.
- **Panel de Control:** Obtén una vista rápida de tu progreso, tareas vencidas y prioridades.

### 📅 **Calendario**
- **Vista de Tareas por Fecha:** Visualiza tus tareas con fechas de vencimiento en un calendario mensual, semanal o diario.
- **Integración con Tareas:** Crea, edita y visualiza los detalles de tus tareas directamente desde el calendario.
- **Filtros y Estadísticas:** Filtra tareas por estado o prioridad y obtén estadísticas de tu carga de trabajo.

### 📓 **Diario Personal**
- **Privacidad y Seguridad:** Protegido con un PIN personal de 4 dígitos para garantizar que tus entradas sean privadas.
- **Registro de Emociones:** Asocia un estado de ánimo a cada entrada para llevar un registro de tu bienestar.
- **Editor Completo:** Escribe entradas detalladas con formato de texto enriquecido.

### ⚙️ **Configuración**
- **Gestión de Perfil:** Actualiza tu información personal.
- **Personalización:** Cambia el tema (claro/oscuro) y el esquema de colores de la aplicación.
- **Información de la App:** Consulta la versión y los créditos de la aplicación.

### 🗑️ **Papelera**
- **Recuperación de Elementos:** Restaura notas, carpetas o tareas que hayas eliminado por error.
- **Eliminación Permanente:** Libera espacio eliminando elementos de forma definitiva.

## Tecnologías Utilizadas

- **Frontend:**
  - **React 19** con **Vite** como empaquetador.
  - **TypeScript** para un código más robusto y mantenible.
  - **React Router** para la gestión de rutas.
  - **Tailwind CSS** para un diseño moderno y personalizable.
  - **Framer Motion** para animaciones fluidas.
  - **Lucide React** para los iconos.
- **Componentes y Librerías Clave:**
  - **React Hook Form** y **Zod** para la gestión y validación de formularios.
  - **React Query (TanStack Query)** para la gestión del estado del servidor y el fetching de datos.
  - **React Big Calendar** para la vista de calendario.
  - **React DND** para la funcionalidad de arrastrar y soltar en el Kanban.
  - **TinyMCE** como editor de texto enriquecido.
  - **SweetAlert2** para notificaciones y confirmaciones elegantes.

## Cómo Empezar

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/AplicacionNotasWEB.git
    cd AplicacionNotasWEB
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```
    o
    ```bash
    yarn install
    ```

### Ejecución

1.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    o
    ```bash
    yarn dev
    ```

2.  Abre tu navegador y visita `http://localhost:5173` (o el puerto que indique la consola).

### Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con Hot-Module Replacement (HMR).
- `npm run build`: Compila la aplicación para producción en la carpeta `dist/`.
- `npm run lint`: Ejecuta ESLint para analizar el código en busca de errores y problemas de estilo.
- `npm run preview`: Inicia un servidor local para previsualizar el build de producción.