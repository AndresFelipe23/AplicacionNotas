# Vista de Tareas (Tablero Kanban)

La vista de `Tareas` implementa un tablero Kanban interactivo para la gestión visual de tareas. Permite a los usuarios organizar su flujo de trabajo moviendo tareas a través de diferentes estados.

## Características Principales

### 1. **Tablero Kanban con Arrastrar y Soltar (Drag and Drop)**

- **Columnas de Estado:** Las tareas se organizan en tres columnas que representan su estado actual: "Por hacer", "En progreso" y "Completadas".
- **Funcionalidad de Arrastrar y Soltar:** Los usuarios pueden mover las tarjetas de tareas (`TareaCard`) de una columna a otra para cambiar su estado. Esta funcionalidad está implementada con `react-dnd`.

### 2. **Gestión de Tareas**

- **Creación de Tareas:** Un botón en la columna "Por hacer" y en la cabecera permite abrir el modal `CrearTareaModal` para añadir nuevas tareas.
- **Edición de Tareas:** Cada tarjeta de tarea tiene una opción para editar, que abre el modal `EditarTareaModal` con la información de la tarea precargada.
- **Marcar como Completada:** Las tareas pueden ser marcadas como completadas directamente desde su tarjeta.
- **Eliminación de Tareas:** Las tareas pueden ser enviadas a la papelera. Se muestra una confirmación antes de la eliminación.

### 3. **Panel Lateral de Control (Sidebar)**

- **Resumen Visual del Progreso:**
  - Muestra una **barra de progreso** con el porcentaje de tareas completadas.
  - Ofrece un desglose del número de tareas en cada estado (Por hacer, En progreso, Completadas).
- **Alertas Importantes:**
  - Resalta las tareas que están **vencidas**, las que **vencen hoy** y las que tienen **alta prioridad** para que el usuario pueda enfocarse en lo más urgente.
- **Vista Semanal:** Indica cuántas tareas están próximas a vencer en los siguientes siete días.

### 4. **Diseño Responsivo**

- **Adaptable a Móviles:** En dispositivos más pequeños, el panel lateral se oculta para dar más espacio al tablero Kanban y se puede acceder a él mediante un botón de menú.
- **Scroll Horizontal:** El tablero Kanban tiene un scroll horizontal para asegurar que todas las columnas sean visibles incluso en pantallas estrechas.

## Componentes Utilizados

- `react-dnd` y `react-dnd-html5-backend`: Para la funcionalidad de arrastrar y soltar.
- `TareaCard`: Componente que representa una tarea individual en el tablero.
- `CrearTareaModal` y `EditarTareaModal`: Modales para crear y editar tareas.
- `usePapelera`: Hook de contexto para actualizar el contador de la papelera cuando se elimina una tarea.
- `sweetalert`: Para los diálogos de confirmación de eliminación.
- `framer-motion`: Para animaciones en la aparición y desaparición de tareas.

## Flujo de Usuario

1.  El usuario accede a la página de "Tareas".
2.  Ve un tablero Kanban con sus tareas organizadas en columnas.
3.  Puede arrastrar una tarea de "Por hacer" a "En progreso" cuando comienza a trabajar en ella.
4.  Una vez finalizada, puede moverla a "Completadas".
5.  Puede crear nuevas tareas o editar las existentes a través de los modales.
6.  El panel lateral le ofrece una visión rápida del estado general de sus proyectos, ayudándole a priorizar su trabajo.
7.  Si elimina una tarea, esta se envía a la papelera para una posible recuperación.