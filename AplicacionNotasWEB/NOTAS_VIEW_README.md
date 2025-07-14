# Vista de Notas

La vista de `Notas` es el componente principal para gestionar las notas de los usuarios. Ofrece una interfaz completa y rica en funciones para crear, ver, editar, organizar y filtrar notas.

## Características Principales

### 1. **Diseño de Doble Panel adaptable**

- **Panel Lateral (Sidebar):** Muestra una lista de todas las notas, junto con opciones de filtrado y organización.
- **Panel Principal (Editor):** Muestra el contenido de la nota seleccionada, permitiendo su edición.
- **Responsivo:** En dispositivos móviles, el panel lateral se oculta para dar más espacio al contenido y se puede mostrar u ocultar según sea necesario.

### 2. **Visualización y Gestión de Notas**

- **Lista de Notas:** Las notas se muestran en el panel lateral usando el componente `NotaMiniCard`.
- **Selección de Nota:** Al hacer clic en una nota de la lista, su contenido completo se carga en el `NotaEditor` en el panel principal.
- **Actualización en Tiempo Real:** Cualquier cambio realizado en una nota (edición, eliminación) se refleja inmediatamente en la lista.
- **Creación de Notas:** Un botón flotante o una opción en el menú permite a los usuarios crear una nueva nota a través del modal `CrearNotaModal`.

### 3. **Búsqueda y Filtrado Avanzado**

La vista incluye múltiples formas de filtrar y encontrar notas rápidamente:

- **Búsqueda General:** Una barra de búsqueda permite filtrar notas por **título**, **contenido** o **etiquetas**.
- **Favoritos:** Un interruptor para mostrar solo las notas marcadas como favoritas.
- **Filtrado por Etiquetas:** Muestra una lista de todas las etiquetas únicas y permite filtrar las notas que contienen una etiqueta específica.
- **Filtrado por Carpetas:** Permite a los usuarios organizar las notas en carpetas y filtrarlas según la carpeta seleccionada.

### 4. **Organización con Carpetas y Etiquetas**

- **Carpetas:**
  - Los usuarios pueden crear carpetas para agrupar notas relacionadas.
  - La barra lateral muestra una lista de carpetas, junto con el número de notas que contiene cada una.
  - Existe una sección para notas que no pertenecen a ninguna carpeta.
- **Etiquetas:**
  - Los usuarios pueden asignar múltiples etiquetas a cada nota.
  - La barra lateral muestra las etiquetas más utilizadas para un filtrado rápido.

### 5. **Estadísticas de Uso**

- Un panel de estadísticas (`EtiquetasStats`) muestra un resumen visual del uso de las etiquetas, ayudando al usuario a entender cómo organiza su información.

### 6. **Modales para Acciones**

- **`CrearNotaModal`:** Se abre para crear una nueva nota. Permite asignarle un título, contenido, etiquetas y opcionalmente una carpeta.
- **`CrearCarpetaModal`:** Permite al usuario crear una nueva carpeta para organizar sus notas.

## Componentes Utilizados

- `NotaMiniCard`: Para mostrar una vista previa de cada nota en la lista.
- `NotaEditor`: Un editor de texto enriquecido para ver y modificar el contenido de la nota seleccionada.
- `SearchBar`: Para la funcionalidad de búsqueda.
- `EtiquetasStats`: Para mostrar estadísticas de las etiquetas.
- `CrearNotaModal`: Modal para la creación de nuevas notas.
- `CrearCarpetaModal`: Modal para la creación de nuevas carpetas.

## Flujo de Usuario

1.  El usuario navega a la página de "Notas".
2.  La aplicación carga todas las notas y carpetas del usuario.
3.  El usuario ve una lista de sus notas en el panel izquierdo.
4.  Puede usar la barra de búsqueda o los filtros para encontrar una nota específica.
5.  Al seleccionar una nota, su contenido se muestra en el editor del panel derecho.
6.  El usuario puede editar la nota y los cambios se guardan automáticamente.
7.  Puede crear nuevas notas o carpetas usando los botones designados, que abren los modales correspondientes.
8.  En un dispositivo móvil, el usuario puede alternar entre la lista de notas y el editor para una experiencia optimizada.