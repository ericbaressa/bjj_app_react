// pages/PositionDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const PositionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosition = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error(error);
      else setPosition(data);

      setLoading(false);
    };

    fetchPosition();
  }, [id]);

  if (loading) return <p style={{ padding: '20px' }}>Cargando...</p>;
  if (!position) return <p style={{ padding: '20px' }}>No se encontró la posición.</p>;

  // Función para convertir URL de YouTube a embed
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
      return url; // Si no es URL válida, devolver tal cual
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link
        to="/positions"
        style={{
          display: 'inline-block',
          marginBottom: '20px',
          textDecoration: 'none',
          color: '#007bff',
          fontWeight: 'bold',
        }}
      >
        ← Volver a posiciones
      </Link>

      <h1 style={{ marginBottom: '20px' }}>
        {position.name_es} / {position.name_en} / {position.name_jp}
      </h1>

      {/* Imagen */}
      <img
        src={position.image}
        alt={position.name_en}
        style={{
          width: '100%',
          borderRadius: '12px',
          marginBottom: '20px',
          objectFit: 'cover',
        }}
      />

      {/* Video de YouTube embebido */}
      {position.video && (
        <div style={{ marginBottom: '20px', position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src={getYouTubeEmbedUrl(position.video)}
            title={position.name_en}
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '12px',
            }}
          ></iframe>
        </div>
      )}

      {/* Tips */}
      {position.tips && (
        <div
          style={{
            backgroundColor: '#f9f9f9',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginBottom: '10px' }}>Tips:</h3>
          <p style={{ margin: 0 }}>{position.tips}</p>
        </div>
      )}
    </div>
  );
};

export default PositionDetail;
