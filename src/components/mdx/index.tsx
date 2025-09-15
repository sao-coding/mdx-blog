// mdxComponents/index.tsx
import React from "react";

import Mermaid from "./Mermaid";
import Echarts from "./Echarts";

function Test({ children }: { children: React.ReactNode }) {
  return <div className="border p-2 my-4 bg-yellow-50">{children}</div>;
}

export { Test, Mermaid, Echarts };
