import React from "react";
import { ICard, IColumn, useAppContext } from "../../AppContext";
import styles from "./styles.module.css";

const Card: React.FC<{ card: ICard; column: IColumn }> = ({ card, column }) => {
  const { setSelectedCard } = useAppContext();
  return (
    <div
      className={styles.card}
      onClick={() => {
        setSelectedCard({ cardId: card.id, columnId: column.id });
      }}
    >
      <div className={styles.title}>
        <span>{card.title}</span>
      </div>
    </div>
  );
};

export default React.memo(Card);
