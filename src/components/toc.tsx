import React from "react";

export interface TocItem {
  value: string;
  href?: string;
  depth?: number;
  numbering?: number[];
  parent?: string;
  children?: TocItem[];
}

export interface TableOfContentProps {
  toc?: TocItem[];
}

function renderToc(items: TocItem[] = []) {
  return (
    <ul className="toc-list">
      {items.map((item) => (
        <li
          key={item.href || item.value}
          className={`toc-item toc-depth-${item.depth ?? 1}`}
        >
          <a href={item.href}>
            {item.numbering ? item.numbering.join(".") + ". " : ""}
            {item.value}
          </a>
          {item.children &&
            item.children.length > 0 &&
            renderToc(item.children)}
        </li>
      ))}
    </ul>
  );
}

export const TableOfContent: React.FC<TableOfContentProps> = ({ toc }) => {
  if (!toc || toc.length === 0) return null;
  return (
    <nav className="toc-container" aria-label="Table of contents">
      <h2 className="toc-title">目錄</h2>
      {renderToc(toc)}
    </nav>
  );
};

export default TableOfContent;
