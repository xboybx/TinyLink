import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import Toast from "./components/Toast";

function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Dashboard showToast={showToast} />} />
        <Route
          path="/code/:code"
          element={<StatsPage showToast={showToast} />}
        />
        {/* Catch-all route: redirect to / */}
        <Route path="*" element={<Dashboard showToast={showToast} />} />
      </Routes>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
