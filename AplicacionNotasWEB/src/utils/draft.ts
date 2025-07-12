// Utilidades para manejar contenido HTML y Draft.js
export function extractPlainTextFromHtml(html: string): string {
  if (!html) return '';
  
  // Crear un elemento temporal para extraer texto
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

export function htmlToPlainText(html: string): string {
  return extractPlainTextFromHtml(html);
}

// Función para limpiar HTML y obtener solo texto
export function stripHtml(html: string): string {
  if (!html) return '';
  
  // Remover todas las etiquetas HTML
  return html.replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Función para convertir contenido Draft.js a texto plano
export function convertDraftToPlainText(draftContent: string): string {
  if (!draftContent) return '';
  
  try {
    const parsed = JSON.parse(draftContent);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      return parsed.blocks.map((block: any) => block.text).join(' ');
    }
  } catch {
    // Si no es JSON válido, asumir que es HTML o texto plano
  }
  
  return draftContent;
}

// Función para obtener un resumen del contenido (maneja tanto Draft.js como HTML)
export function getContentSummary(content: string, maxLength: number = 150): string {
  if (!content) return '';
  
  let plainText = '';
  
  // Intentar parsear como Draft.js primero
  try {
    const parsed = JSON.parse(content);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      plainText = parsed.blocks.map((block: any) => block.text).join(' ');
    } else {
      // Si no es Draft.js, tratar como HTML
      plainText = stripHtml(content);
    }
  } catch {
    // Si no es JSON válido, tratar como HTML
    plainText = stripHtml(content);
  }
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.substring(0, maxLength) + '...';
}

// Función para validar si el contenido está vacío
export function isContentEmpty(content: string): boolean {
  if (!content) return true;
  
  let plainText = '';
  
  // Intentar parsear como Draft.js primero
  try {
    const parsed = JSON.parse(content);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      plainText = parsed.blocks.map((block: any) => block.text).join(' ');
    } else {
      plainText = stripHtml(content);
    }
  } catch {
    plainText = stripHtml(content);
  }
  
  return plainText.trim().length === 0;
}

// Función para convertir contenido Draft.js a HTML
export function convertDraftToHtml(draftContent: string): string {
  if (!draftContent) return '';
  
  try {
    const parsed = JSON.parse(draftContent);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      // Convertir bloques Draft.js a HTML básico
      return parsed.blocks.map((block: any) => {
        const text = block.text || '';
        switch (block.type) {
          case 'header-one':
            return `<h1>${text}</h1>`;
          case 'header-two':
            return `<h2>${text}</h2>`;
          case 'header-three':
            return `<h3>${text}</h3>`;
          case 'unordered-list-item':
            return `<li>${text}</li>`;
          case 'ordered-list-item':
            return `<li>${text}</li>`;
          case 'blockquote':
            return `<blockquote>${text}</blockquote>`;
          default:
            return `<p>${text}</p>`;
        }
      }).join('');
    }
  } catch {
    // Si no es JSON válido, devolver el contenido tal como está
  }
  
  return draftContent;
} 