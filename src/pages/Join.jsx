import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Placeholder from "./Placeholder.jsx";

const Join = () => {
  const location = useLocation();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return;

    const state = url.searchParams.get("state");
    const targetPath = state && state.startsWith("/") ? state : "/membership";
    const targetUrl = new URL(targetPath, window.location.origin);
    targetUrl.searchParams.set("code", code);

    window.location.replace(targetUrl.toString());
  }, [location.search]);

  return (
    <Placeholder
      title="Discord コミュニティへの参加"
      description="一般公開のコミュニティ誘導LPをここに配置予定です。Discord招待リンクとメンバーシップへの導線を含むページを後日実装します。"
    />
  );
};

export default Join;
