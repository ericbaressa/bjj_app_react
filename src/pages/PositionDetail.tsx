// pages/PositionDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import FullscreenModal from "../components/FullscreenModal";
interface Position {
  id: number;
  name_es: string;
  name_en: string;
  name_jp: string;
  image: string;
  video?: string;
  tips?: string;
}

// POSICIÓN POR DEFECTO
const defaultPosition: Position = {
  id: 0,
  name_es: "Posición por defecto",
  name_en: "Default position",
  name_jp: "デフォルトポジション",
  image: "https://via.placeholder.com/800x450?text=Sin+imagen",
  video: "",
  tips: "Esta es una posición por defecto.",
};

const PositionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosition = async () => {
      setLoading(true);

      // Buscamos por id
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('id', Number(id))
        .single();

      if (error || !data) {
        // Si no existe, cargamos la PRIMERA posición de la tabla
        const { data: firstData } = await supabase
          .from('positions')
          .select('*')
          .limit(1)
          .single();

        setPosition(firstData || null);
      } else {
        setPosition(data);
      }

      setLoading(false);
    };

    fetchPosition();
  }, [id]);

  if (loading) return <p style={{ padding: '20px' }}>Cargando...</p>;

  // SI NO HAY NINGUNA POSICIÓN, usa la por defecto
  const currentPosition = position || defaultPosition;

  // Convertir URL de YouTube a embed
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
      return url;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>
        {currentPosition.name_es} / {currentPosition.name_en} / {currentPosition.name_jp}
      </h1>

      {/* Imagen */}
      <img
        src={currentPosition.image}
        alt={currentPosition.name_en}
        style={{
          width: '100%',
          borderRadius: '12px',
          marginBottom: '20px',
          objectFit: 'cover',
        }}
      />

      {/* Video */}
      {currentPosition.video && (
        <div style={{ marginBottom: '20px', position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src={getYouTubeEmbedUrl(currentPosition.video)}
            title={currentPosition.name_en}
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
          />
        </div>
      )}

      {/* Tips */}
      {currentPosition.tips && (
        <div
          style={{
            backgroundColor: '#f9f9f9',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginBottom: '10px' }}>Tips:</h3>
          <p style={{ margin: 0 }}>{currentPosition.tips}</p>
        </div>
      )}
    </div>
  );
};

export default PositionDetail;
