import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import styles from "./SavedCombos.module.css";

interface Combo {
  id: number;
  name: string;
}

interface Position {
  id: number;
  name_es: string;
  name_en: string;
  image: string;
}

interface ComboStep {
  position_id: number;
  step_index: number;
}

interface ComboStepWithPosition {
  step_index: number;
  position: Position;
}

const SavedCombos: React.FC = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);

  const [steps, setSteps] = useState<ComboStepWithPosition[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    const { data, error } = await supabase
      .from("combos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setCombos(data || []);
  };

  const loadComboSteps = async (comboId: number) => {
    setLoadingSteps(true);

    const { data: stepsData, error: stepsError } = await supabase
      .from("combo_steps")
      .select("step_index, position_id")
      .eq("combo_id", comboId)
      .order("step_index", { ascending: true });

    if (stepsError || !stepsData) {
      console.error(stepsError);
      setLoadingSteps(false);
      return;
    }

    const ids = stepsData.map((s) => s.position_id);

    const { data: positionsData, error: positionsError } = await supabase
      .from("positions")
      .select("*")
      .in("id", ids);

    if (positionsError || !positionsData) {
      console.error(positionsError);
      setLoadingSteps(false);
      return;
    }

    const stepsWithPositions: ComboStepWithPosition[] = stepsData.map((s) => ({
      step_index: s.step_index,
      position: positionsData.find((p) => p.id === s.position_id)!,
    }));

    setSteps(stepsWithPositions);
    setLoadingSteps(false);
  };

  const selectCombo = (combo: Combo) => {
    setSelectedCombo(combo);
    loadComboSteps(combo.id);
  };

  return (
    <div className={styles.page}>
      <h2>Combos guardados</h2>

      <div className={styles.listContainer}>
        {combos.map((combo) => (
          <div
            key={combo.id}
            className={`${styles.comboItem} ${
              selectedCombo?.id === combo.id ? styles.selected : ""
            }`}
            onClick={() => selectCombo(combo)}
          >
            <span>{combo.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.timelineContainer}>
        {loadingSteps ? (
          <p>Cargando...</p>
        ) : !selectedCombo ? (
          <p>Selecciona un combo para ver su línea temporal</p>
        ) : steps.length === 0 ? (
          <p>Este combo no tiene pasos guardados</p>
        ) : (
          <div className={styles.timeline}>
            {steps.map((s, index) => (
              <div key={s.step_index} className={styles.step}>
                <div className={styles.card}>
                  <img src={s.position.image} alt={s.position.name_en} />
                  <div className={styles.text}>
                    <strong>{s.position.name_es}</strong>
                    <p>{s.position.name_en}</p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className={styles.arrow}>↓</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCombos;
