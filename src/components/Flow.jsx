export default function Flow({ arquivo, processando, resultado }) {
  return (
    <div className="flow">
      <div className={`flow-node ${arquivo ? "is-on" : ""}`}>
        <div className="flow-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
        </div>
        <span>Planilha</span>
      </div>
      <div className={`flow-line ${arquivo ? "is-active" : ""}`}><span className="flow-pulse" /></div>
      <div className={`flow-node flow-core ${processando ? "is-running" : arquivo ? "is-on" : ""}`}>
        <div className="flow-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="30" height="30">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
        </div>
        <span>Organizar</span>
      </div>
      <div className={`flow-line ${resultado ? "is-active" : ""}`}><span className="flow-pulse" /></div>
      <div className={`flow-node ${resultado ? "is-on" : ""}`}>
        <div className="flow-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <span>ZIP pronto</span>
      </div>
    </div>
  );
}
