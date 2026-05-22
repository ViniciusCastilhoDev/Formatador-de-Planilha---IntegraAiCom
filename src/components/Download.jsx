export default function Download({ processando, progresso, arquivo, onClick }) {
  return (
    <button className="btn btn-primary btn-large" disabled={processando || !arquivo} onClick={onClick}>
      {processando ? `Organizando... ${Math.round(progresso)}%` : "Preparar e baixar ZIP"}
      {!processando && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )}
    </button>
  );
}
