// mdxComponents/index.tsx
import React from 'react'

import Mermaid from './renderers/mermaid'
import Echarts from './renderers/echarts'

function Test({ children }: { children: React.ReactNode }) {
  return <div className="border p-2 my-4 bg-yellow-50">{children}</div>
}

export { Test, Mermaid, Echarts }
