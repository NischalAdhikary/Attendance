

import { useState } from "react";
import { ChevronLeft,ChevronRight } from "lucide-react";
const Pagination = ({ totalPages = 12, initialPage = 1 }) => {
  const [current, setCurrent] = useState(initialPage);

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const go = (page) => {
    if (page >= 1 && page <= totalPages) setCurrent(page);
  };

  const pages = getPages();

  return (
    <div className="mt-10" style={{
    
      background: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      gap: "2rem",
    }}>
     

      <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Prev */}
        <button onClick={() => go(current - 1)} disabled={current === 1} style={arrowBtn(current === 1)}>
          <ChevronLeft />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dot-${i}`} style={{ padding: "0 4px", color: "#bbb", fontSize: "1rem", lineHeight: "36px" }}>…</span>
          ) : (
            <button key={p} onClick={() => go(p)} style={pageBtn(p === current)}>
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button onClick={() => go(current + 1)} disabled={current === totalPages} style={arrowBtn(current === totalPages)}>
          <ChevronRight />
        </button>
      </nav>

     
    </div>
  );
};

const base = {
  border: "1.5px solid #ddd",
  borderRadius: "6px",
  background: "#fff",
  cursor: "pointer",
  fontFamily: "'Georgia', serif",
  fontSize: "0.9rem",
  transition: "all 0.15s ease",
  lineHeight: 1,
};

const pageBtn = (active) => ({
  ...base,
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: active ? "#222" : "#fff",
  color: active ? "#fff" : "#444",
  borderColor: active ? "#222" : "#ddd",
  fontWeight: active ? "bold" : "normal",
  transform: active ? "scale(1.05)" : "scale(1)",
  boxShadow: active ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
});

const arrowBtn = (disabled) => ({
  ...base,
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: disabled ? "#ccc" : "#444",
  cursor: disabled ? "not-allowed" : "pointer",
  background: "#fff",
});
export default Pagination