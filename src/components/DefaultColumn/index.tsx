import React, { useState } from "react";
import { useAppContext } from "../../AppContext";
import styles from "./styles.module.css";
import commonStyles from "../commonStyles.module.css";

const DefaultColumn: React.FC = () => {
  const { addColumn } = useAppContext();

  const [columnName, setColumnName] = useState<string>("");

  const columnNameIsValid = !!columnName?.trim();

  const handleClick = () => {
    if (columnNameIsValid) addColumn(columnName);
    setColumnName("");
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Add a column"
        className={`${commonStyles.input} ${styles.input}`}
        value={columnName}
        onChange={(e) => setColumnName(e.target.value)}
      />
      <button
        className={styles.button}
        disabled={!columnNameIsValid}
        onClick={handleClick}
      >
        Add column
      </button>
    </div>
  );
};

export default React.memo(DefaultColumn);
