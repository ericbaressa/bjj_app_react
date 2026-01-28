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
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // 🔒 evita scroll global
      }}
    >
      {/* HEADER FIJO */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#1a1a1a",   // mismo fondo que el resto
            padding: "50px",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          <h1 style={{
            margin: 0,
            fontSize: "clamp(16px, 2.5vw, 22px)",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {currentPosition.name_es} / {currentPosition.name_en} / {currentPosition.name_jp}
          </h1>
        </div>
  
      {/* CONTENIDO SCROLLABLE */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {/* Imagen */}
        <img
          src={currentPosition.image}
          alt={currentPosition.name_en}
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "20px",
            objectFit: "cover",
          }}
        />
  
        {/* Video */}
        {currentPosition.video && (
          <div
            style={{
              marginBottom: "20px",
              position: "relative",
              paddingTop: "56.25%",
            }}
          >
            <iframe
              src={getYouTubeEmbedUrl(currentPosition.video)}
              title={currentPosition.name_en}
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "12px",
              }}
            />
          </div>
        )}
  
        {/* Tips */}
        {currentPosition.tips && (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #2a2a2a",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Tips</h3>
            <p style={{ margin: 0 }}>{currentPosition.tips}</p>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default PositionDetail;
