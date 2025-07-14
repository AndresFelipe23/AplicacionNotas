# Vista de Diario

La vista de `Diario` es una sección segura y personal donde los usuarios pueden registrar sus pensamientos, emociones y actividades diarias. Está protegida por un PIN para garantizar la privacidad.

## Características Principales

### 1. **Seguridad con PIN**

- **Protección de Acceso:** Antes de acceder al diario, el sistema verifica si el usuario ha configurado un PIN. 
  - Si no hay un PIN, se le solicita al usuario que cree uno a través del modal `CrearPinModal`.
  - Si ya existe un PIN, se le pide al usuario que lo ingrese para autenticarse usando el modal `VerificarPinModal`.
- **Contexto de Autenticación:** Utiliza `usePinDiario` para gestionar el estado de autenticación del PIN en toda la sección del diario.

### 2. **Interfaz de Diario**

- **Diseño de Doble Panel:**
  - **Panel Lateral (Sidebar):** Muestra una lista de las entradas del mes actual, permitiendo al usuario navegar entre ellas. También incluye un selector para cambiar de mes y año.
  - **Panel Principal:** Muestra el contenido de la entrada seleccionada para ese día.
- **Editor de Texto Enriquecido:** Utiliza `TinyMCEEditor` para que los usuarios puedan formatear sus entradas con títulos, listas, negritas, etc.

### 3. **Gestión de Entradas**

- **Creación de Entradas:** Los usuarios pueden crear una nueva entrada para la fecha seleccionada. Si ya existe una entrada para ese día, el sistema lo notifica para evitar duplicados.
- **Visualización y Edición:**
  - Al seleccionar una entrada de la lista, su contenido se muestra en modo de solo lectura.
  - Un botón "Editar" permite activar el modo de edición para modificar el título, el contenido y el estado de ánimo.
- **Estado de Ánimo:** Los usuarios pueden asociar un estado de ánimo a cada entrada (desde "Muy mal" hasta "Excelente"), representado con emojis para una referencia visual rápida.

### 4. **Navegación y Filtrado**

- **Navegación por Fechas:** El panel lateral permite cambiar fácilmente entre meses y años para revisar entradas pasadas.
- **Selección de Día:** Al hacer clic en una entrada de la lista, el panel principal se actualiza para mostrar el contenido de ese día.

### 5. **Estadísticas del Diario**

- **Resumen Mensual:** El panel lateral muestra un resumen rápido del número de entradas y la cantidad de "días buenos" (basado en el estado de ánimo).
- **Estadísticas Detalladas:** Un modal de estadísticas ofrece un análisis más profundo del mes, incluyendo el total de palabras escritas y un desglose de los estados de ánimo registrados.

### 6. **Diseño Responsivo**

- La interfaz se adapta a dispositivos móviles, ocultando el panel lateral para dar prioridad al contenido y haciéndolo accesible a través de un botón de menú.

## Componentes Utilizados

- `TinyMCEEditor`: Para la edición de texto enriquecido.
- `CrearPinModal` y `VerificarPinModal`: Para la gestión de la seguridad del PIN.
- `CrearEntradaDiarioModal`: Modal para crear nuevas entradas.
- `usePinDiario`: Hook para gestionar la autenticación del PIN.
- `diarioService`: Servicio para interactuar con la API del diario (obtener, crear, actualizar entradas).

## Flujo de Usuario

1.  El usuario navega a la sección "Diario".
2.  Si es la primera vez, se le pide que cree un PIN de 4 dígitos.
3.  Si ya tiene un PIN, debe ingresarlo para acceder.
4.  Una vez autenticado, ve la interfaz del diario.
5.  Puede navegar por las entradas del mes en el panel lateral.
6.  Al seleccionar una fecha, ve la entrada correspondiente o un mensaje para crear una si no existe.
7.  Puede crear una nueva entrada o editar una existente usando el editor de texto.
8.  Puede ver estadísticas sobre sus entradas para reflexionar sobre sus patrones de estado de ánimo y escritura.