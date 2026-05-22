export default function Upload({ arquivo, analisando, analise, drag, errors, onDragChange, onDrop, onArquivoChange }) {
  return (
    <>
      <label
        className={`file-drop ${arquivo ? "is-loaded" : ""} ${drag ? "is-drag" : ""} ${errors.arquivo ? "is-error" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          onDragChange(true);
        }}
        onDragLeave={() => onDragChange(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(event) => onArquivoChange(event.target.files[0] || null)}
          hidden
        />
        <div className="file-left">
          <div className="file-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="file-info">
            <strong>{arquivo ? arquivo.name : "Arraste ou escolha a planilha"}</strong>
            <span>{criarDescricaoArquivo({ arquivo, analisando, analise })}</span>
          </div>
        </div>
        <span className="file-btn">{arquivo ? "Trocar" : "Selecionar"}</span>
      </label>
      {errors.arquivo && <div className="field-error">{errors.arquivo}</div>}
    </>
  );
}

function criarDescricaoArquivo({ arquivo, analisando, analise }) {
  if (!arquivo) return "Aceita .xlsx, .xls e .csv";
  if (analisando) return "Analisando estrutura...";
  if (analise) {
    const plural = analise.abas.length > 1 ? "s" : "";
    return `${analise.abas.length} aba${plural} · ${(arquivo.size / 1024).toFixed(1)} KB`;
  }
  return `${(arquivo.size / 1024).toFixed(1)} KB`;
}
