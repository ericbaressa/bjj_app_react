import React, { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "../services/supabaseClient";
import styles from "./Transiciones.module.css";
import "../App.css";
import { Link } from "react-router-dom";

interface Position {
  id: number;
  name_es: string;
  name_en: string;
  name_jp: string;
  image: string;
}

const MAX_VISIBLE = 5;
const OFFSET = 40;

const Sequence: React.FC = () => {
  const [history, setHistory] = useState<Position[]>([]);
  const [available, setAvailable] = useState<Position[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [comboName, setComboName] = useState("");
  const [tempComboName, setTempComboName] = useState("");
  const [openSaveModal, setOpenSaveModal] = useState(false);

  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllPositions();
  }, []);

  const fetchAllPositions = async () => {
    setLoading(true);
    const { data } = await supabase.from("positions").select("*");
    setAvailable(data || []);
    setLoading(false);
  };

  const filteredAvailable = useMemo(() => {
    const text = filter.trim().toLowerCase();
    if (!text) return available;
    return available.filter(
      (p) =>
        p.name_es.toLowerCase().includes(text) ||
        p.name_en.toLowerCase().includes(text) ||
        p.name_jp.toLowerCase().includes(text)
    );
  }, [filter, available]);

  const selectPosition = async (pos: Position) => {
    setHistory((h) => [...h, pos]);
    setLoading(true);

    const { data: toIdsData } = await supabase
      .from("positions_transitions")
      .select("to_id")
      .eq("from_id", pos.id);

    const uniqueToIds = Array.from(new Set(toIdsData?.map((x: any) => x.to_id)));

    const { data: positionsData } = await supabase
      .from("positions")
      .select("*")
      .in("id", uniqueToIds);

    setAvailable(positionsData || []);
    setLoading(false);
  };

  const undo = async () => {
    setHistory((h) => {
      const newHistory = [...h];
      newHistory.pop();

      const lastPos = newHistory[newHistory.length - 1];

      if (!lastPos) {
        fetchAllPositions();
      } else {
        supabase
          .from("positions_transitions")
          .select("to_id")
          .eq("from_id", lastPos.id)
          .then(async ({ data }) => {
            const ids = data?.map((x: any) => x.to_id) || [];
            const { data: positionsData } = await supabase
              .from("positions")
              .select("*")
              .in("id", ids);

            setAvailable(positionsData || []);
          });
      }

      return newHistory;
    });
  };

  const reset = () => {
    setHistory([]);
    setFilter("");
    fetchAllPositions();
  };

  const saveCombo = async (name?: string) => {
    const comboNameToUse = name ?? comboName;

    if (history.length < 2) {
      alert("Debes elegir al menos 2 posiciones para guardar.");
      return;
    }

    if (!comboNameToUse.trim()) {
      alert("Pon un nombre a tu combinación.");
      return;
    }

    setSaving(true);

    const { data: comboData, error: comboError } = await supabase
      .from("combos")
      .insert({ name: comboNameToUse })
      .select("id")
      .single();

    if (comboError || !comboData) {
      alert("Error al crear combo");
      setSaving(false);
      return;
    }

    const comboId = comboData.id;

    const steps = history.map((p, index) => ({
      combo_id: comboId,
      position_id: p.id,
      step_index: index,
    }));

    const { error: stepsError } = await supabase
      .from("combo_steps")
      .insert(steps);

    if (stepsError) {
      alert("Error al guardar pasos");
    } else {
      alert("Combinación guardada ✔️");
      reset();
      setComboName("");
      setTempComboName("");
    }

    setSaving(false);
  };

  const visibleHistory = [...history].slice(-MAX_VISIBLE);

  return (
    <div className="page">

      <div className="positionsHeader_h1">
        {history.length === 0 && <h1>Escoge posiciones</h1>}
      </div>

      {visibleHistory.length > 0 && (
        <div className={styles.stackHoverArea} ref={stackRef}>
          <div className={styles.stack}>
            {visibleHistory.map((p, index) => {
              const centerIndex = visibleHistory.length - 1;
              const baseOffset = (index - centerIndex) * OFFSET;

              const distance = centerIndex - index;
              const isHovered = hoverIndex === index;

              // 🔥 ORIENTACIÓN B — inclinadas hacia atrás
              const angle = 20 * distance; // rotateX positivo
              const translateZ = -20 * distance;
              const translateY = distance * 2;
              const scale = isHovered ? 1: 1;

              const z = isHovered ? 999 : index + 1;

              return (
                <div
                  key={p.id}
                  className={styles.stackItem}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  style={{
                    transform: `
                      translateX(${baseOffset}px)
                      translateY(${translateY}px)
                      translateZ(${translateZ}px)
                      rotateX(${angle}deg)
                      scale(${scale})
                    `,
                    transformStyle: "preserve-3d",
                    zIndex: z,
                    transition: "transform 0.25s ease, z-index 0.25s ease",
                  }}
                >
                  <img src={p.image} alt={p.name_en} />
                  <div className={styles.lastName}>{p.name_es}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="topbar">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar posiciones..."
        />
      </div>

      <div className="topbar">
        <button onClick={undo} disabled={history.length === 0}>
          Deshacer
        </button>

        <button onClick={reset}>Borrar todo</button>

        <button
          onClick={() => setOpenSaveModal(true)}
          disabled={saving || history.length < 2}
        >
          {saving ? "Guardando..." : "Guardar combinación"}
        </button>

        <Link to="/SavedCombos">
          <button>Combos</button>
        </Link>
      </div>

      <div className={styles.list}>
        {loading ? (
          <p>Cargando...</p>
        ) : filteredAvailable.length === 0 ? (
          <p>No hay siguientes posibles</p>
        ) : (
          filteredAvailable.map((pos) => (
            <div
              key={pos.id}
              className={styles.card}
              onClick={() => selectPosition(pos)}
            >
              <img src={pos.image} alt={pos.name_en} />
              <div>
                <strong>{pos.name_es}</strong>
                <p>{pos.name_en}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {openSaveModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Nombre de la combinación</h3>

            <input
              value={tempComboName}
              onChange={(e) => setTempComboName(e.target.value)}
              placeholder="Ej: Combo 1"
            />

            <div className={styles.modalButtons}>
              <button onClick={() => setOpenSaveModal(false)}>Cancelar</button>

              <button
                onClick={() => {
                  setComboName(tempComboName);
                  setOpenSaveModal(false);
                  saveCombo(tempComboName);
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sequence;
