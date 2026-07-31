import { useState } from "react";
export default function App() {
  const [tableCode, setTableCode] = useState("");
function createTable() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  setTableCode(code);
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