import React, { useState, useRef, useEffect } from "react";

export default function SimpleComboBox({ label, options, value, setValue, field, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSearch("");
  };

  return (
    <div className="flex flex-col gap-1 relative" ref={ref}>
      {label && <label className="font-semibold text-black">{label}</label>}

      <div
        className="border rounded px-2 py-1 w-full cursor-pointer"
        onClick={handleOpen}
      >
        {selectedLabel || placeholder || "Select..."}
      </div>

      {isOpen && (
        <div className="absolute bg-white border rounded w-full mt-1 z-50 shadow-lg" style={{ top: "100%" }}>
          {/* Search input */}
          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-blue-400"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-auto">
            {filtered.map((opt) => (
              <div
                key={opt.value}
                className={`px-2 py-2 hover:bg-gray-100 cursor-pointer ${opt.value === value ? "bg-blue-50 font-semibold" : ""}`}
                onClick={() => {
                  setValue((prev) => ({ ...prev, [field]: opt.value }));
                  setIsOpen(false);
                  setSearch("");
                }}
              >
                {opt.label}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-2 py-2 text-gray-400 text-sm">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}