import { useState } from "react";
export default function App() {
  const [tableCode, setTableCode] = useState("");
  function createTable() {
    setTableCode("TEST1");
  }
  return (
    <div>
      <h1>WHIST ONLINE</h1> <button onClick={createTable}>CREA TAVOLO</button> 
      {tableCode && (
        <div>
          <h2>Codice Tavolo</h2>
          <h1>{tableCode}</h1>
        </div>
      )}
    </div>
  );
}