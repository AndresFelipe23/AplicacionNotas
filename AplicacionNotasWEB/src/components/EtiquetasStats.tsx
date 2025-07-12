import React from 'react';
import { Tag } from 'lucide-react';
import type { Nota } from '../types/nota';

interface EtiquetasStatsProps {
  notas: Nota[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

interface TagStats {
  name: string;
  count: number;
  percentage: number;
}

const EtiquetasStats: React.FC<EtiquetasStatsProps> = ({ notas, selectedTag, onTagSelect }) => {
  // Calcular estadísticas de etiquetas
  const tagStats = React.useMemo(() => {
    const tagCounts: Record<string, number> = {};
    let totalNotas = 0;

    notas.forEach(nota => {
      if (nota.etiquetas) {
        nota.etiquetas.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
      totalNotas++;
    });

    const stats: TagStats[] = Object.entries(tagCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalNotas > 0 ? Math.round((count / totalNotas) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 etiquetas

    return stats;
  }, [notas]);

  if (tagStats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Tag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No hay etiquetas disponibles</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Etiquetas más usadas</span>
      </div>
      
      <div className="space-y-2">
        {tagStats.map((tag) => (
          <button
            key={tag.name}
            onClick={() => onTagSelect(selectedTag === tag.name ? null : tag.name)}
            className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
              selectedTag === tag.name
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{tag.name}</span>
              <span className="text-xs text-gray-500">({tag.count})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${tag.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">
                {tag.percentage}%
              </span>
            </div>
          </button>
        ))}
      </div>
      
      {selectedTag && (
        <button
          onClick={() => onTagSelect(null)}
          className="w-full mt-3 text-xs text-blue-600 hover:text-blue-700"
        >
          Limpiar filtro
        </button>
      )}
    </div>
  );
};

export default EtiquetasStats; 