import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface Position {
  id: number;
  name_es: string;
  name_en: string;
  name_jp: string;
  image: string;
  video?: string;
  tips?: string;
}

const PAGE_SIZE = 10;

const Positions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);

      const { count } = await supabase
        .from('positions')
        .select('id', { count: 'exact', head: true });

      setTotal(count || 0);

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase.from('positions').select('*').range(from, to);
      if (filter) query = query.ilike('name_es', `%${filter}%`);

      const { data, error } = await query;

      if (error) console.error(error);
      else setPositions(data || []);

      setLoading(false);
    };

    fetchPositions();
  }, [page, filter]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Posiciones</h1>

      {/* Filtro */}
      <input
        type="text"
        placeholder="Filtrar por nombre..."
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setPage(0);
        }}
        style={{
          padding: '8px',
          width: '100%',
          marginBottom: '20px',
          borderRadius: '6px',
          boxSizing: 'border-box',
        }}
      />

      {loading ? (
        <p>Cargando...</p>
      ) : positions.length === 0 ? (
        <p>No hay posiciones que coincidan.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {positions.map((pos) => (
            <div
              key={pos.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // para que el video quede a la derecha
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: 'white',
                width: '100%',
              }}
            >
              {/* Imagen */}
              <img
                src={pos.image}
                alt={pos.name_en}
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  marginRight: '16px',
                  flexShrink: 0,
                }}
              />

              {/* Nombres */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  flexGrow: 1,
                }}
              >
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  🇪🇸 {pos.name_es}
                </span>
                <span style={{ color: '#555' }}>🇬🇧 {pos.name_en}</span>
                <span style={{ color: '#888', fontStyle: 'italic' }}>
                  🇯🇵 {pos.name_jp}
                </span>
              </div>

              {/* Link YouTube */}
              {pos.video && (
                <a
                  href={pos.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: '16px',
                    padding: '8px 12px',
                    backgroundColor: '#ff0000',
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  🎬 Ver video
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            style={{ marginRight: '10px', padding: '8px 16px' }}
          >
            Anterior
          </button>
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page + 1 >= totalPages}
            style={{ marginLeft: '10px', padding: '8px 16px' }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Positions;
