import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./services/firebase";
export default function App() {
  const [tableCode, setTableCode] = useState("");
  function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  async function createTable() {
    const code = generateCode();
    await setDoc(doc(collection(db, "tables"), code), {
      tableId: code,
      status: "waiting",
      createdAt: new Date().toISOString(),
      players: {},
    });
    setTableCode(code);
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "20px",
      }}
    >
      <h1>WHIST ONLINE</h1> <button onClick={createTable}>CREA TAVOLO</button> 
      {tableCode && (
        <>
          <h2>Codice Tavolo</h2>
          <h1>{tableCode}</h1>
        </>
      )}
    </div>
  );
}