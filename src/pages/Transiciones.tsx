import React, { useEffect, useMemo, useState } from "react";
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
const OFFSET = 40; // viejas a la izquierda

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

  const selectPosition = (pos: Position) => {
    setHistory((h) => [...h, pos]);
  };

  const undo = () => {
    setHistory((h) => h.slice(0, -1));
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

      {/* STACK */}
      {visibleHistory.length > 0 && (
        <div className={styles.stackHoverArea}>
          <div className={styles.stack}>
            {visibleHistory.map((p, index) => {
              const centerIndex = visibleHistory.length - 1;
              const baseOffset = (index - centerIndex) * OFFSET;

              const isHovered = hoverIndex === index;
              const scale = isHovered ? 1.1 : 1;
              const z = isHovered ? 999 : index + 1;

              return (
                <div
                  key={p.id}
                  className={styles.stackItem}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  style={{
                    transform: `translateX(${baseOffset}px) scale(${scale})`,
                    zIndex: z,
                    transition: "transform 0.2s ease, z-index 0.2s ease",
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

      {/* TOPBAR */}
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

      {/* LISTA */}
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

      {/* MODAL GUARDAR */}
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
