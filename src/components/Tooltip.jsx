import { useState } from "react";

export default function Tooltip({ text }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="tooltip-wrap">
      <button
        className="tooltip-btn"
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
        aria-label="Ajuda"
      >
        ?
      </button>
      {open && <span className="tooltip-box">{text}</span>}
    </span>
  );
}
