# Vista de Home

La vista de `Home` es la página de inicio de la aplicación, diseñada para dar la bienvenida al usuario y ofrecerle una entrada rápida y motivadora a sus actividades.

## Características Principales

### 1. **Saludo Personalizado y Dinámico**

- **Mensaje de Bienvenida:** Saluda al usuario con un "¡Buenos días!", "¡Buenas tardes!" o "¡Buenas noches!" dependiendo de la hora del día.
- **Nombre de Usuario:** Si el usuario ha iniciado sesión, muestra su nombre para una experiencia más personal.
- **Animaciones de Entrada:** Utiliza `framer-motion` para presentar los elementos con animaciones suaves, haciendo la bienvenida más atractiva.

### 2. **Lema Inspirador**

- Muestra un lema que resume el propósito de la aplicación: "Captura tus ideas, organiza tus pensamientos y transforma tu productividad".

### 3. **Acceso Rápido a Funcionalidades Clave**

- **Nota Rápida:** El componente principal de esta vista es `NotaRapida`, que permite al usuario crear una nota de forma instantánea sin tener que navegar a la sección de notas completa. Esto es ideal para capturar ideas al vuelo.

### 4. **Estadísticas (Actualmente Deshabilitado)**

- El código contiene una sección comentada para mostrar estadísticas clave como el número de notas, tareas y favoritos. Aunque no está activa, la estructura está preparada para implementarse fácilmente en el futuro.

### 5. **Mensaje Motivacional**

- Incluye una pequeña frase inspiradora para motivar al usuario: "Las mejores ideas surgen cuando menos las esperas".

## Componentes Utilizados

- `NotaRapida`: Un componente que permite la creación rápida de notas.
- `useUser`: Un hook para obtener la información del usuario actual del contexto.
- `motion` (de `framer-motion`): Para añadir animaciones a los elementos de la interfaz.
- Iconos de `lucide-react`: Para mejorar la presentación visual de la página.

## Flujo de Usuario

1.  El usuario accede a la página de inicio (`/home`).
2.  Es recibido con un saludo personalizado y animado.
3.  Tiene acceso inmediato al componente `NotaRapida` para apuntar cualquier idea sin interrupciones.
4.  La página le ofrece una experiencia limpia y enfocada, animándole a interactuar con la aplicación.