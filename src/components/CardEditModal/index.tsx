import React, { useState } from "react";
import { useAppContext } from "../../AppContext";
import styles from "./styles.module.css";

interface Props {
  selectedCard: {
    cardId: string;
    columnId: string;
  };
}

const CardEditModal: React.FC<Props> = ({ selectedCard }) => {
  const { setSelectedCard, editCard, cards, columns, moveCard } =
    useAppContext();

  const card = cards.get(selectedCard.cardId);
  const column = columns.find(({ id }) => id === selectedCard.columnId);

  const [description, setDescription] = useState(card?.description);
  const [selectedColumn, setSelectedColumn] = useState(column?.id);

  const handleSave = () => {
    if (!card || !column || !selectedColumn) return;
    if (selectedColumn !== column.id)
      moveCard({
        originColumnId: column.id,
        targetColumnId: selectedColumn,
        cardId: card.id,
      });
    editCard({ id: card.id, cardFields: { description } });
    setSelectedCard(undefined);
  };

  return card ? (
    <div
      className={styles.container}
      onClick={(e) => setSelectedCard(undefined)}
    >
      <div
        className={styles.popup}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h3>{card.title}</h3>
        <div className={styles.columnSelector}>
          Column:
          <select
            className={styles.selectMenu}
            value={selectedColumn ?? column?.id}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            {columns.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <h4>Description:</h4>
        <textarea
          className={styles.description}
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
        >
          {description}
        </textarea>
        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.saveButton}`}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            onClick={() => setSelectedCard(undefined)}
            className={`${styles.button}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default React.memo(CardEditModal);
