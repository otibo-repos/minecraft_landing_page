import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Legal from "./pages/Legal.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import Join from "./pages/Join.jsx";
import Contract from "./pages/Contract.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/join" element={<Join />} />
        <Route path="/membership" element={<Home />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/legal/:section" element={<Legal />} />
        <Route
          path="/contract"
          element={
            <Contract
              title="支援手続き"
              description="支援者表示やロール付与の同意を確認し、Stripe への最終ステップに進みます。"
            />
          }
        />
        <Route
          path="/community"
          element={
            <Placeholder
              title="Join / Community LP"
              description="コミュニティ誘導用の独立LPを近日公開予定です。"
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
