// import { useState, useEffect } from "react";
import { useWaku } from "./components/WakuProvider";
import { StepAsideScreen } from "./components/StepAsideScreen";
import "./App.css";

function App() {
  const { stage, node } = useWaku();

  console.log(stage, node);

  const handleBack = () => {
    console.log('handleBack');
  };
  const handlePaste = () => {
    // your paste logic
    console.log('Paste pressed');
  };
  const handleCreate = () => {
    // your create logic
    console.log('Create pressed');
  };

  return (
    <StepAsideScreen
      onBack={handleBack}
      onPaste={handlePaste}
      onCreate={handleCreate}
    />
  );
}

export default App;
