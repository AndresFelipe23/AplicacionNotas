import React, { useState } from 'react';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

interface DraftEditorProps {
  onSave?: (rawContent: any) => void;
}

const DraftEditor: React.FC<DraftEditorProps> = ({ onSave }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [saving, setSaving] = useState(false);

  const handleSaveAndClear = async () => {
    setSaving(true);
    const content = editorState.getCurrentContent();
    const rawContent = convertToRaw(content);
    if (onSave) {
      await onSave(rawContent);
    } else {
      // Simulación de guardado (puedes reemplazar por llamada real a API)
      console.log('Nota guardada:', rawContent);
    }
    setEditorState(EditorState.createEmpty());
    setSaving(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-6 mt-8">
      {/* Botón X */}
      <button
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/80 text-white font-bold text-lg shadow hover:bg-red-700 transition-all duration-200 z-10"
        onClick={handleSaveAndClear}
        disabled={saving}
        title="Guardar y limpiar"
      >
        ×
      </button>
      <div className="min-h-[120px] cursor-text text-white text-base px-2 py-1 rounded focus:outline-none bg-transparent">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Escribe tu nota aquí..."
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all duration-200 disabled:opacity-60"
          onClick={handleSaveAndClear}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar y limpiar'}
        </button>
      </div>
    </div>
  );
};

export default DraftEditor; 