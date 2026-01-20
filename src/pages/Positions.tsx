import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './Positions.module.css';

interface Position {
  id: number;
  name_es: string;
  name_en: string;
  name_jp: string;
  image: string;
  image_thumb: string;
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
    <div className={styles.positionsPage}>
      <div className={styles.positionsHeader}>
        <h1>Posiciones</h1>

        <input
          type="text"
          placeholder="Filtrar por nombre..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <div className={styles.positionsList}>
        {loading ? (
          <p>Cargando...</p>
        ) : positions.length === 0 ? (
          <p>No hay posiciones que coincidan.</p>
        ) : (
          positions.map((pos) => (
            <Link key={pos.id} to={`/positions/${pos.id}`} className={styles.positionItem}>
              <div className={styles.positionImage}>
                <img src={pos.image_thumb} alt={pos.name_en} loading="lazy" />
              </div>

              <div className={styles.positionInfo}>
                <strong>🇪🇸 {pos.name_es}</strong>
                <span>🇬🇧 {pos.name_en}</span>
                <em>🇯🇵 {pos.name_jp}</em>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.positionsPagination}>
          <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
            Anterior
          </button>
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page + 1 >= totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Positions;
