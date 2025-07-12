import React, { useEffect, useState, useRef, useCallback } from 'react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  placeholder = "Escribe el contenido de tu nota...",
  height = "100%",
  disabled = false
}) => {
  const [Editor, setEditor] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const editorRef = useRef<any>(null);
  const lastValueRef = useRef<string>('');
  const isUserTypingRef = useRef<boolean>(false);
  const initialValueRef = useRef<string>(value);
  const lastExternalValueRef = useRef<string>(value);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const debouncedOnChange = useCallback((content: string) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      if (!isUserTypingRef.current) {
        onChange(content);
      }
    }, 500);
  }, [onChange]);

  useEffect(() => {
    const loadEditor = async () => {
      try {
        console.log('Cargando TinyMCE...');
        const { Editor: TinyMCEEditor } = await import('@tinymce/tinymce-react');
        setEditor(() => TinyMCEEditor);
        setIsLoaded(true);
        console.log('TinyMCE cargado exitosamente');
      } catch (error) {
        console.error('Error loading TinyMCE:', error);
      }
    };

    loadEditor();
  }, []);

  const tinymceConfig = {
    height,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
      'bold italic underline strikethrough | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'link image | removeformat | help',
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 16px;
        line-height: 1.7;
        color: #374151;
        margin: 0;
        padding: 20px;
        background-color: #ffffff;
      }
      p { margin: 0 0 1.2em 0; }
      h1, h2, h3, h4, h5, h6 { 
        margin: 0 0 0.8em 0; 
        font-weight: 600; 
        color: #111827;
        line-height: 1.3;
      }
      h1 { font-size: 2em; }
      h2 { font-size: 1.5em; }
      h3 { font-size: 1.25em; }
      ul, ol { 
        margin: 0 0 1.2em 0; 
        padding-left: 1.5em; 
      }
      li { margin: 0 0 0.5em 0; }
      blockquote { 
        margin: 0 0 1.2em 0; 
        padding: 1em 1.5em; 
        border-left: 4px solid #e5e7eb; 
        background-color: #f9fafb;
        color: #6b7280;
        font-style: italic;
      }
      a { 
        color: #3b82f6; 
        text-decoration: underline; 
        text-decoration-thickness: 1px;
      }
      a:hover { 
        color: #2563eb; 
        text-decoration-thickness: 2px;
      }
      img { 
        max-width: 100%; 
        height: auto; 
        border-radius: 8px;
        margin: 1em 0;
      }
      code {
        background-color: #f3f4f6;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 0.9em;
      }
      pre {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1em;
        overflow-x: auto;
        margin: 1.2em 0;
      }
      pre code {
        background-color: transparent;
        padding: 0;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1.2em 0;
      }
      table th, table td {
        border: 1px solid #e5e7eb;
        padding: 0.75em;
        text-align: left;
      }
      table th {
        background-color: #f9fafb;
        font-weight: 600;
      }
      hr {
        border: none;
        border-top: 1px solid #e5e7eb;
        margin: 2em 0;
      }
    `,
    placeholder,
    readonly: disabled,
    branding: false,
    elementpath: false,
    resize: false,
    statusbar: false,
    setup: (editor: any) => {
      console.log('Configurando TinyMCE editor...');
      editorRef.current = editor;
      
      // Evento cuando el usuario empieza a escribir
      editor.on('KeyDown', () => {
        isUserTypingRef.current = true;
      });

      // Evento cuando el usuario termina de escribir
      editor.on('KeyUp', () => {
        isUserTypingRef.current = true;
        
        // Resetear después de un delay más largo
        setTimeout(() => {
          isUserTypingRef.current = false;
        }, 1000);
      });

      // Evento cuando cambia el contenido
      editor.on('Change', () => {
        const content = editor.getContent();
        if (content !== lastValueRef.current) {
          lastValueRef.current = content;
          debouncedOnChange(content);
        }
      });

      // Evento cuando se inicializa
      editor.on('init', () => {
        console.log('TinyMCE inicializado');
        setIsInitialized(true);
        if (initialValueRef.current) {
          editor.setContent(initialValueRef.current);
          lastValueRef.current = initialValueRef.current;
        }
      });

      // Evento cuando se hace clic en el editor
      editor.on('Click', () => {
        isUserTypingRef.current = false;
      });

      // Evento cuando se enfoca el editor
      editor.on('Focus', () => {
        isUserTypingRef.current = false;
      });
    }
  };

  // Solo actualizar cuando el valor cambia externamente y no por el usuario
  useEffect(() => {
    if (isInitialized && editorRef.current && value !== lastExternalValueRef.current && !isUserTypingRef.current) {
      const editor = editorRef.current;
      const currentContent = editor.getContent();
      
      // Solo actualizar si el contenido es realmente diferente
      if (value !== currentContent) {
        editor.setContent(value);
        lastValueRef.current = value;
        lastExternalValueRef.current = value;
      }
    }
  }, [value, isInitialized]);

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  console.log('Renderizando TinyMCEEditor:', { isLoaded, Editor: !!Editor, isInitialized });

  // Versión de prueba con un textarea simple si TinyMCE no carga
  if (!isLoaded || !Editor) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center p-4 bg-gray-50 border-b">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
          <span className="text-sm text-gray-600">Cargando editor TinyMCE...</span>
        </div>
        <textarea
          className="flex-1 p-4 border-none outline-none resize-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className="h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
      <Editor
        apiKey="4r0enz2s3xqrtubpmpkmvyr37bqgg144z2f2l1q70bnsyceu"
        init={tinymceConfig}
        initialValue={initialValueRef.current}
      />
    </div>
  );
};

export default TinyMCEEditor; 