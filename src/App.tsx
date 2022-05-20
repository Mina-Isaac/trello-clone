import React from "react";
import "./App.css";
import { useAppContext } from "./AppContext";
import CardEditModal from "./components/CardEditModal";
import Columns from "./components/Columns";

function App() {
  const { selectedCard } = useAppContext();
  return (
    <>
      {selectedCard && <CardEditModal selectedCard={selectedCard} />}
      <div className="App">
        <Columns />
      </div>
    </>
  );
}

export default App;
