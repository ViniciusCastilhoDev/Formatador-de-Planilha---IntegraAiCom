export default function WorkflowBar({ arquivo, analisando, processando, resultado }) {
  const step1On = Boolean(arquivo);
  const step2On = Boolean(arquivo);
  const step3On = Boolean(resultado);
  const line1Active = Boolean(arquivo);
  const line2Active = Boolean(resultado);

  const fileName = arquivo ? arquivo.name.replace(/\.[^.]+$/, "") : null;

  return (
    <div className="wf-bar">
      <div className="wf-steps">
        <div className={`wf-step${step1On ? " is-on" : ""}`}>
          <div className="wf-step-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="15" y2="17" />
            </svg>
          </div>
          <span className="wf-step-label">Planilha</span>
        </div>

        <div className={`wf-connector${line1Active ? " is-active" : ""}`}>
          <span className="wf-pulse" />
        </div>

        <div className={`wf-step${step2On ? " is-on" : ""}${processando ? " is-running" : ""}`}>
          <div className="wf-step-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
          </div>
          <span className="wf-step-label">Organizar</span>
        </div>

        <div className={`wf-connector${line2Active ? " is-active" : ""}`}>
          <span className="wf-pulse" />
        </div>

        <div className={`wf-step${step3On ? " is-on" : ""}`}>
          <div className="wf-step-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="wf-step-label">ZIP pronto</span>
        </div>
      </div>

      <div className="wf-status">
        {fileName ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="wf-file-name">{fileName}</span>
            {analisando && <span className="wf-status-tag">Analisando...</span>}
            {resultado && (
              <span className="wf-status-tag wf-status-ok">
                {resultado.validos.toLocaleString("pt-BR")} contatos válidos
              </span>
            )}
          </>
        ) : (
          <span className="wf-hint">Envie uma planilha para começar</span>
        )}
      </div>
    </div>
  );
}
