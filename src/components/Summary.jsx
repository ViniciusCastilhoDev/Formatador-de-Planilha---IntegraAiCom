export default function Summary({ arquivo, analisando, analise, resultado, titulo, processando, progresso, statusMsg }) {
  return (
    <div className="mockup">
      <div className="mockup-head">
        <div className="mockup-left">
          <div className="mockup-dot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <div>
            <strong>{titulo || "contatos"}_preparados.zip</strong>
            <small>{criarDescricaoStatus({ arquivo, analisando, analise, resultado })}</small>
          </div>
        </div>
        <span className={`mockup-badge ${processando ? "is-run" : resultado ? "is-done" : ""}`}>
          {processando ? "Gerando" : resultado ? "Pronto" : analise ? "Analisado" : "Preview"}
        </span>
      </div>

      <div className="mockup-progress">
        <div className="mockup-progress-label">
          <span>{statusMsg || (resultado ? "Concluído" : "Aguardando")}</span>
          <span className="mockup-pct">{processando ? `${Math.round(progresso)}%` : resultado ? "100%" : "0%"}</span>
        </div>
        <div className="mockup-bar">
          <div className="mockup-fill" style={{ width: processando ? `${progresso}%` : resultado ? "100%" : "0%" }} />
        </div>
      </div>

      {arquivo && analise && !resultado && <AbasDetectadas analise={analise} />}
      {resultado && <Metricas resultado={resultado} />}
      {!arquivo && <div className="mockup-empty">Envie uma planilha para ver a prévia e o resultado da preparação aqui.</div>}
    </div>
  );
}

function AbasDetectadas({ analise }) {
  return (
    <div className="abas-detectadas">
      <div className="abas-head">
        <span>Abas detectadas</span>
        <strong>{analise.abas.length}</strong>
      </div>
      <div className="abas-chips">
        {analise.abas.slice(0, 10).map((aba) => (
          <span className="aba-chip" key={aba}>{aba}</span>
        ))}
        {analise.abas.length > 10 && <span className="aba-chip aba-chip-more">+{analise.abas.length - 10}</span>}
      </div>
    </div>
  );
}

function Metricas({ resultado }) {
  return (
    <div className="metricas">
      <div className="m-title">
        <span className="m-dot" />
        Processo finalizado — ZIP baixado
      </div>
      <div className="metricas-grid">
        <div className="metrica"><strong>{resultado.abas}</strong><span>Abas lidas</span></div>
        <div className="metrica"><strong>{resultado.secoes}</strong><span>Seções detectadas</span></div>
        <div className="metrica"><strong>{resultado.grupos}</strong><span>Pastas geradas</span></div>
        <div className="metrica"><strong>{resultado.linhas}</strong><span>Linhas analisadas</span></div>
        <div className="metrica m-ok"><strong>{resultado.validos}</strong><span>Contatos válidos</span></div>
        <div className="metrica m-warn"><strong>{resultado.invalidos}</strong><span>Inválidos removidos</span></div>
        <div className="metrica m-warn"><strong>{resultado.duplicados}</strong><span>Duplicados removidos</span></div>
        <div className="metrica m-ok"><strong>{resultado.arquivos}</strong><span>Arquivos de disparo</span></div>
        <div className="metrica"><strong>{resultado.formato}</strong><span>Formato final</span></div>
      </div>
      <div className="m-note">Inclui relatórios em <code>relatorios/</code> com inválidos, duplicados e resumo.</div>
    </div>
  );
}

function criarDescricaoStatus({ arquivo, analisando, analise, resultado }) {
  if (!arquivo) return "Aguardando planilha";
  if (analisando) return "Analisando estrutura...";
  if (resultado) return `${resultado.validos.toLocaleString("pt-BR")} contatos · ${resultado.arquivos} arquivos`;
  if (analise) {
    const plural = analise.abas.length > 1 ? "s" : "";
    return `${analise.abas.length} aba${plural} pronta${plural} para preparar`;
  }
  return "";
}
