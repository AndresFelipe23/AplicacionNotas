# Configuración de SweetAlert2

## Instalación

Para instalar SweetAlert2 en el proyecto, ejecuta:

```bash
cd AplicacionNotasWEB
npm install sweetalert2
```

## Configuración

SweetAlert2 ya está configurado en el proyecto con:

### Archivo de utilidades: `src/utils/sweetalert.ts`

Este archivo contiene funciones predefinidas para diferentes tipos de alertas:

- `confirmDelete(title, text)` - Para confirmaciones de eliminación
- `showSuccess(title, text?, timer?)` - Para mensajes de éxito
- `showError(title, text?)` - Para mensajes de error
- `showInfo(title, text?)` - Para mensajes informativos

### Uso en componentes

```typescript
import { confirmDelete, showSuccess, showError } from '../utils/sweetalert';

// Confirmar eliminación
const result = await confirmDelete('¿Eliminar?', 'Esta acción no se puede deshacer');
if (result.isConfirmed) {
  // Proceder con la eliminación
}

// Mostrar éxito
await showSuccess('¡Éxito!', 'Operación completada');

// Mostrar error
await showError('Error', 'Algo salió mal');
```

## Características implementadas

✅ **Eliminación de notas** - Confirmación con SweetAlert2
✅ **Papelera** - Todas las operaciones usan SweetAlert2
✅ **Estilo consistente** - Configuración unificada
✅ **Responsive** - Funciona en móvil y desktop

## Personalización

Para cambiar el estilo de las alertas, modifica el archivo `src/utils/sweetalert.ts`:

```typescript
export const sweetAlertConfig = {
  customClass: {
    popup: 'rounded-lg shadow-xl',
    confirmButton: 'rounded-lg font-medium',
    cancelButton: 'rounded-lg font-medium'
  },
  confirmButtonColor: '#ef4444',
  cancelButtonColor: '#6b7280'
};
``` 