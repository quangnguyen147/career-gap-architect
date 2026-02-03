import { useEffect, useState } from "react";
import InputPanel from "./components/InputPanel";
import ResultPanel from "./components/ResultPanel";
import Questions from "./components/Questions";
import LearningRoadmap from "./components/LearningRoadmap";
import { Alert, AlertIcon } from "@chakra-ui/react";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!error) return;

    setTimeout(() => {
      setError(null);
    }, 5000);
  }, [error]);

  console.log(error);

  return (
    <div className="app-container">
      <InputPanel
        loading={loading}
        setLoading={setLoading}
        setError={setError}
        setResult={setResult}
      />

      <Alert
        status={error?.success ? "success" : "error"}
        variant="left-accent"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          width: "fit-content",
          maxW: "90dvw",
          transform: !error ? "translateX(-130%)" : "translateX(0)",
          transition: "all .4s ease",
          zIndex: 100,
        }}
      >
        <AlertIcon />
        {error?.message}
      </Alert>

      {result && <ResultPanel result={result} />}
      {loading && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="wrapper">
            <div className="box-wrap">
              <div className="box one"></div>
              <div className="box two"></div>
              <div className="box three"></div>
              <div className="box four"></div>
              <div className="box five"></div>
              <div className="box six"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
