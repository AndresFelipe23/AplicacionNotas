# Vista de Calendario

La vista de `Calendario` proporciona una interfaz visual e interactiva para que los usuarios gestionen sus tareas. Utiliza la librería `react-big-calendar` para mostrar las tareas en un calendario mensual, semanal o diario.

## Características Principales

### 1. **Visualización de Tareas**

- **Calendario Interactivo:** Muestra las tareas en un calendario, permitiendo a los usuarios ver sus compromisos de un vistazo.
- **Vistas Múltiples:** Soporta vistas de mes, semana, día y agenda para adaptarse a las preferencias del usuario.
- **Eventos Codificados por Colores:** Los eventos en el calendario se colorean según la prioridad de la tarea, facilitando la identificación rápida de las tareas más importantes.

### 2. **Gestión de Tareas**

- **Creación de Tareas:**
  - Los usuarios pueden hacer clic en una fecha específica del calendario para abrir el modal `CrearTareaModal` con la fecha ya seleccionada.
  - También hay un botón "Nueva tarea" para crear tareas sin una fecha predefinida.
- **Ver Detalles de Tarea:** Al hacer clic en un evento del calendario, se abre el modal `DetalleTareaModal`, que muestra toda la información de la tarea.
- **Edición y Eliminación:** Desde el modal de detalles, los usuarios pueden optar por editar la tarea (lo que abre `EditarTareaModal`) o eliminarla.

### 3. **Panel Lateral de Control (Sidebar)**

- **Filtros:** Un panel lateral permite a los usuarios filtrar las tareas que se muestran en el calendario por:
  - **Estado:** Pendiente, En progreso, Completada.
  - **Prioridad:** Mostrar solo tareas de alta prioridad.
  - **Vencimiento:** Mostrar solo tareas vencidas.
- **Estadísticas:** El panel también muestra un resumen de las tareas visibles, incluyendo:
  - Número total de eventos.
  - Cantidad de tareas completadas, en progreso y de alta prioridad.
- **Barra de Progreso:** Una barra visual muestra el porcentaje de tareas completadas.

### 4. **Diseño Responsivo**

- **Adaptable a Móviles:** En dispositivos móviles, el panel lateral se oculta y se puede acceder a él a través de un botón de menú, optimizando el espacio para el calendario.
- **Vistas de Calendario Optimizadas:** En pantallas pequeñas, las vistas disponibles se reducen a "mes" y "agenda" para una mejor usabilidad.

## Componentes Utilizados

- `react-big-calendar`: La librería principal para la funcionalidad del calendario.
- `CrearTareaModal`: Para añadir nuevas tareas.
- `EditarTareaModal`: Para modificar tareas existentes.
- `DetalleTareaModal`: Para mostrar los detalles completos de una tarea.
- `sweetalert`: Para mostrar notificaciones de éxito o error.
- Iconos de `lucide-react`: Para una interfaz de usuario clara y atractiva.

## Flujo de Usuario

1.  El usuario accede a la página de "Calendario".
2.  La aplicación carga y muestra todas las tareas del usuario en el calendario.
3.  El usuario puede cambiar entre las vistas de mes, semana, día o agenda.
4.  Puede usar los filtros en el panel lateral para acotar las tareas mostradas.
5.  Al hacer clic en una fecha, puede crear una nueva tarea para ese día.
6.  Al hacer clic en una tarea existente, puede ver sus detalles, editarla o eliminarla.
7.  En un dispositivo móvil, el panel de filtros y estadísticas está disponible a través de un menú para no saturar la pantalla.