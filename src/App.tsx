// import { useState, useEffect } from "react";
import { useWaku } from "./components/WakuProvider";
import "./App.css";

function App() {
  const { stage, node } = useWaku();

  console.log(stage, node);

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          // greet();~
        }}
      >
        <input
          id="greet-input"
          // onChange={(e) /=> setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      {/* <p>{greetMsg}</p> */}
    </main>
  );
}

export default App;
