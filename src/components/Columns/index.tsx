import React from "react";
import { useAppContext } from "../../AppContext";
import DefaultColumn from "../DefaultColumn";
import Column from "../Column";
import styles from "./styles.module.css";

const Columns: React.FC = () => {
  const { columns } = useAppContext();

  return (
    <div className={styles.container}>
      {columns.map((column) => {
        return <Column key={column.id} column={column} />;
      })}
      <DefaultColumn />
    </div>
  );
};

export default React.memo(Columns);
