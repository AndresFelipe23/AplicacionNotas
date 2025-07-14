# Vista de Configuración

La vista de `Configuración` es el centro de control del usuario, donde puede gestionar su perfil, personalizar la apariencia de la aplicación y obtener información sobre la misma.

## Características Principales

### 1. **Navegación por Pestañas**

- La interfaz está organizada en pestañas para separar las diferentes secciones de configuración, como "Perfil" y "Acerca de".
- La navegación es clara y utiliza iconos para una fácil identificación.

### 2. **Gestión del Perfil de Usuario**

- **Información Personal:** Muestra el nombre completo y el correo electrónico del usuario.
- **Edición de Nombre:** Permite al usuario editar su nombre (la funcionalidad de guardado está pendiente de implementación).
- **Cierre de Sesión:** Un botón prominente permite al usuario cerrar su sesión de forma segura.

### 3. **Personalización del Tema**

- **Selección de Tema:** Ofrece opciones para que el usuario elija su tema preferido (claro, oscuro o sincronizado con el sistema).
- **Esquemas de Color:** Permite seleccionar entre varios esquemas de color para personalizar aún más la apariencia de la aplicación.
- **Restablecer Tema:** Un botón para volver a la configuración de tema por defecto.

### 4. **Configuración de Notificaciones**

- Permite al usuario activar o desactivar diferentes tipos de notificaciones, como correos electrónicos y notificaciones push para tareas, recordatorios y marketing (funcionalidad pendiente de implementación).

### 5. **Sección "Acerca de"**

- **Información de la Aplicación:** Muestra el nombre de la aplicación (`NexusNote`), su eslogan y la versión actual.
- **Créditos del Desarrollador:** Incluye un enlace al perfil de GitHub del desarrollador.
- **Apoyo al Proyecto:** Contiene un enlace para que los usuarios puedan apoyar el desarrollo de la aplicación (por ejemplo, a través de "Buy Me a Coffee").

## Componentes Utilizados

- `useUser`: Hook para acceder a los datos del usuario.
- `useTheme`: Hook para gestionar el tema y los esquemas de color de la aplicación.
- `framer-motion`: Para animaciones fluidas en las transiciones entre pestañas y la carga de la página.
- Iconos de `lucide-react`: Para una interfaz visualmente atractiva y comprensible.

## Flujo de Usuario

1.  El usuario accede a la página de "Configuración".
2.  Ve una interfaz dividida con un menú de pestañas a la izquierda y el contenido a la derecha.
3.  En la pestaña "Perfil", puede ver su información y (en el futuro) editarla.
4.  En la pestaña "Apariencia", puede cambiar el tema y el color de la aplicación para adaptarla a sus gustos.
5.  En la pestaña "Acerca de", puede encontrar información sobre la aplicación y el desarrollador.
6.  Desde cualquier punto, puede cerrar sesión usando el botón en la cabecera.