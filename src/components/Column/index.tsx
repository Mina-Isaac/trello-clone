import React, { useState } from "react";
import { useAppContext, IColumn } from "../../AppContext";
import Card from "../Card";
import styles from "./styles.module.css";
import commonStyles from "../commonStyles.module.css";

const Column: React.FC<{ column: IColumn }> = ({ column }) => {
  const { addCard, editColumn, cards: cardMap, removeColumn } = useAppContext();
  const { id, name, cards } = column;
  const [columnName, setColumnName] = useState(name);
  const [newCardTitle, setNewCardTitle] = useState<string>();

  return (
    <div className={styles.column}>
      <input
        value={columnName}
        className={commonStyles.input}
        onChange={(e) => setColumnName(e.currentTarget.value)}
        onBlur={() => editColumn({ id, columnFields: { name: columnName } })}
      />

      <div className={styles.cards}>
        {cards.map((c) => {
          const card = cardMap.get(c);
          return card && <Card key={card.id} card={card} column={column} />;
        })}
      </div>
      {/* onClick={() => removeColumn(column.id)} */}
      {!newCardTitle && (
        <button
          className={styles.button}
          onClick={() => setNewCardTitle("New card")}
        >
          + Add a card
        </button>
      )}
      <button
        className={`${styles.button} ${styles.deleteButton}`}
        onClick={() => removeColumn(column.id)}
      >
        Delete column
      </button>

      {newCardTitle && (
        <div className={styles.newCard}>
          <input
            className={commonStyles.input}
            autoFocus
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
          <button
            className={styles.button}
            onClick={() => {
              addCard({ columnId: column.id, title: newCardTitle });
              setNewCardTitle(undefined);
            }}
          >
            Save
          </button>
          <button
            className={styles.button}
            onClick={() => {
              setNewCardTitle(undefined);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Column);
