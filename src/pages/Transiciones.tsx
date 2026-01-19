import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabaseClient";
import styles from "./Transiciones.module.css";
import SavedCombos from "./SavedCombos";
import { Link } from "react-router-dom";
interface Position {
  id: number;
  name_es: string;
  name_en: string;
  name_jp: string;
  image: string;
}

const Sequence: React.FC = () => {
  const [history, setHistory] = useState<Position[]>([]);
  const [available, setAvailable] = useState<Position[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [comboName, setComboName] = useState("");

  // ✅ ESTADOS PARA EL MODAL
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [tempComboName, setTempComboName] = useState("");

  // Cargar todas las posiciones al inicio
  useEffect(() => {
    fetchAllPositions();
  }, []);

  const fetchAllPositions = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("positions")
      .select("*");

    setAvailable(data || []);
    setLoading(false);
  };

  // FILTRO por texto (sobre available)
  const filteredAvailable = useMemo(() => {
    const text = filter.trim().toLowerCase();
    if (!text) return available;
    return available.filter((p) =>
      p.name_es.toLowerCase().includes(text) ||
      p.name_en.toLowerCase().includes(text) ||
      p.name_jp.toLowerCase().includes(text)
    );
  }, [filter, available]);

  // Seleccionar una posición
  const selectPosition = async (pos: Position) => {
    setHistory((h) => [...h, pos]);
    setLoading(true);
  
    // 1) obtener to_id únicos desde transitions
    const { data: toIdsData } = await supabase
      .from("positions_transitions")
      .select("to_id")
      .eq("from_id", pos.id);
  
    const uniqueToIds = Array.from(new Set(toIdsData?.map((x: any) => x.to_id)));
  
    // 2) traer posiciones disponibles
    const { data: positionsData } = await supabase
      .from("positions")
      .select("*")
      .in("id", uniqueToIds);
  
    setAvailable(positionsData || []);
    setLoading(false);
  };

  // DESHACER último movimiento
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
          .select("*")
          .eq("from_id", lastPos.id)
          .then(({ data }) => {
            setAvailable(data || []);
          });
      }

      return newHistory;
    });
  };

  // RESET total
  const reset = () => {
    setHistory([]);
    setFilter("");
    fetchAllPositions();
  };

  // GUARDAR combinación
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

    // 1) crear combo
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

    // 2) insertar pasos
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

  return (
    <div className={styles.page}>

      <div className={styles.history}>
        {history.length === 0 ? (
          <p>Elige una posición para empezar</p>
        ) : (
          history.map((p) => (
            <div key={p.id} className={styles.historyItem}>
              <img src={p.image} alt={p.name_en} />
              <span>{p.name_es}</span>
            </div>
          ))
        )}
      </div>
      <div className={styles.topbar}>
      <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar posiciones..."
        />
      </div>
      <div className={styles.topbar}>


        <button onClick={undo} disabled={history.length === 0}>
          Deshacer
        </button>

        <button onClick={reset}>
          Borrar todo
        </button>



        <button
        onClick={() => setOpenSaveModal(true)}
        disabled={saving || history.length <2}
      >
        {saving ? "Guardando..." : "Guardar combinación"}
      </button>

      <Link to="/SavedCombos" className={styles.linkButton}>
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

      {/* MODAL DE GUARDADO */}
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
