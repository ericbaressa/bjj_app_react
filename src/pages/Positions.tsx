import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import FullscreenModal from "../components/FullscreenModal";
interface Position {
  id: number;
  name_es: string;
  name_en: string;
  name_jp: string;
  image: string;
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
      <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>Posiciones</h1>

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
          fontSize: 'clamp(12px, 2vw, 16px)',
        }}
      />

      {loading ? (
        <p style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>Cargando...</p>
      ) : positions.length === 0 ? (
        <p style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>No hay posiciones que coincidan.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {positions.map((pos) => (
            <Link
              key={pos.id}
              to={`/positions/${pos.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#1a1a1a',
                width: '100%',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div
                style={{
                  width: '30%',
                  maxWidth: '140px',
                  aspectRatio: '1 / 1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  marginRight: '16px',
                  background: '#222',
                }}
              >
                <img
                  src={pos.image}
                  alt={pos.name_en}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                <span style={{ fontWeight: 'bold', fontSize: 'clamp(14px, 2vw, 18px)' }}>
                  🇪🇸 {pos.name_es}
                </span>
                <span style={{ color: '#555', fontSize: 'clamp(12px, 1.8vw, 16px)' }}>
                  🇬🇧 {pos.name_en}
                </span>
                <span
                  style={{
                    color: '#888',
                    fontStyle: 'italic',
                    fontSize: 'clamp(11px, 1.6vw, 14px)',
                  }}
                >
                  🇯🇵 {pos.name_jp}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              fontSize: 'clamp(12px, 1.8vw, 16px)',
            }}
          >
            Anterior
          </button>
          <span style={{ fontSize: 'clamp(12px, 1.8vw, 16px)' }}>
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page + 1 >= totalPages}
            style={{
              marginLeft: '10px',
              padding: '8px 16px',
              fontSize: 'clamp(12px, 1.8vw, 16px)',
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Positions;
