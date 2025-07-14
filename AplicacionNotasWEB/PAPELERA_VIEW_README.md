# Vista de Papelera

La vista de `Papelera` es donde los usuarios pueden gestionar los elementos que han eliminado, como notas, carpetas o tareas. Ofrece la posibilidad de restaurarlos o eliminarlos permanentemente.

## Características Principales

### 1. **Listado de Elementos Eliminados**

- **Vista Unificada:** Muestra una lista de todos los elementos que han sido enviados a la papelera, independientemente de su tipo (Nota, Carpeta, Tarea).
- **Información Detallada:** Para cada elemento, se muestra:
  - Un **icono** representativo del tipo de elemento.
  - El **título** del elemento.
  - Una etiqueta con el **tipo** (Nota, Carpeta, etc.).
  - La **fecha** en que fue eliminado.
  - Si aplica, el nombre de la **carpeta** a la que pertenecía.

### 2. **Acciones sobre los Elementos**

- **Restaurar:** Cada elemento tiene un botón para restaurarlo a su ubicación original. Esta acción lo saca de la papelera y lo vuelve a hacer accesible en su sección correspondiente (Notas, Tareas, etc.).
- **Eliminar Permanentemente:** Un botón permite eliminar un elemento de forma definitiva. Esta acción es irreversible y se pide confirmación al usuario antes de proceder.

### 3. **Gestión Global de la Papelera**

- **Vaciar Papelera:** Un botón principal permite eliminar todos los elementos de la papelera de una sola vez. Al igual que la eliminación individual, esta acción es permanente y requiere confirmación.
- **Actualización:** Un botón para recargar la lista de elementos de la papelera.

### 4. **Contexto de Papelera**

- **Contador Actualizado:** La vista utiliza `usePapelera` para comunicarse con un contexto global. Después de cada acción (restaurar, eliminar, vaciar), actualiza un contador que se puede mostrar en otras partes de la aplicación (como en la barra lateral) para indicar cuántos elementos hay en la papelera.

### 5. **Manejo de Estados**

- **Carga:** Muestra un indicador de carga mientras se obtienen los elementos de la papelera.
- **Vacío:** Si no hay elementos eliminados, muestra un mensaje indicando que la papelera está vacía.
- **Error:** En caso de un problema al cargar los datos, muestra un mensaje de error con la opción de reintentar la carga.

## Componentes Utilizados

- `papeleraService`: Un servicio para manejar la lógica de negocio y las llamadas a la API relacionadas con la papelera.
- `usePapelera`: Un hook de contexto para mantener sincronizado el estado de la papelera a través de la aplicación.
- `sweetalert`: Para mostrar diálogos de confirmación antes de realizar acciones destructivas (eliminar permanentemente o vaciar).
- Iconos de `lucide-react`: Para una representación visual clara de las acciones y los tipos de elementos.

## Flujo de Usuario

1.  El usuario elimina una nota, carpeta o tarea desde su respectiva vista.
2.  El elemento se mueve a la papelera.
3.  El usuario navega a la página de "Papelera".
4.  Ve una lista de todos los elementos eliminados.
5.  Para un elemento específico, puede elegir entre restaurarlo o eliminarlo para siempre.
6.  Si lo desea, puede vaciar toda la papelera con un solo clic, previa confirmación.
7.  Cualquier acción actualiza el contador de la papelera en la interfaz principal.