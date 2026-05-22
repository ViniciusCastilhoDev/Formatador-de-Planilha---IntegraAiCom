function resolverNumeroFallback(row, colunaNumero, colunasAlternativas) {
  const principal = String(row[colunaNumero] ?? "").replace(/\D/g, "");
  if (principal) return { numero: principal, colunaUsada: colunaNumero, usouFallback: false };

  for (const col of (colunasAlternativas || [])) {
    const val = String(row[col] ?? "").replace(/\D/g, "");
    if (val) return { numero: val, colunaUsada: col, usouFallback: true };
  }

  return { numero: "", colunaUsada: colunaNumero, usouFallback: false };
}

function aplicarDDDPrevia(numero, rawDDD) {
  if (!numero) return { dddUsado: "—", numeroFinal: "(vazio)" };
  if (rawDDD != null) {
    const ddd = String(rawDDD).replace(/\D/g, "");
    if (numero.length < 10 && ddd) return { dddUsado: ddd, numeroFinal: ddd + numero };
    return { dddUsado: "—", numeroFinal: numero };
  }
  return { dddUsado: "—", numeroFinal: numero };
}

export default function PreviewPanel({ linhasAmostra, colunaNome, colunaNumero, adicionarDDD, colunaDDD, colunasAlternativas }) {
  if (!linhasAmostra?.length || !colunaNome || !colunaNumero) return null;

  const linhas = linhasAmostra.slice(0, 5);
  const mostraDDD = adicionarDDD && colunaDDD;
  const temAlternativas = colunasAlternativas && colunasAlternativas.length > 0;

  return (
    <div className="preview-panel">
      <div className="preview-panel-head">
        <div className="preview-panel-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <div className="preview-panel-head-text">
          <strong>Prévia da montagem</strong>
          <span>{linhas.length} linha{linhas.length !== 1 ? "s" : ""} reais da planilha</span>
        </div>
      </div>

      <div className="preview-table-wrap">
        <table className="preview-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Nº original</th>
              {temAlternativas && <th>Coluna usada</th>}
              {mostraDDD && <th>DDD</th>}
              <th>Número final</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((row, i) => {
              const rawOriginal = row[colunaNumero] ?? "";
              const { numero, colunaUsada, usouFallback } = resolverNumeroFallback(row, colunaNumero, colunasAlternativas);
              const rawDDD = mostraDDD ? (row[colunaDDD] ?? null) : null;
              const { dddUsado, numeroFinal } = aplicarDDDPrevia(numero, rawDDD);
              return (
                <tr key={i}>
                  <td className="preview-nome">{row[colunaNome] || <span className="preview-vazio">(vazio)</span>}</td>
                  <td className="preview-original">{rawOriginal || <span className="preview-vazio">(vazio)</span>}</td>
                  {temAlternativas && (
                    <td className={`preview-coluna-usada${usouFallback ? " preview-coluna-fallback" : ""}`}>
                      {colunaUsada}
                    </td>
                  )}
                  {mostraDDD && <td className="preview-ddd">{dddUsado}</td>}
                  <td className="preview-final">{numeroFinal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {temAlternativas && (
        <div className="preview-fallback-info">
          Fallback ativo · ordem: {colunasAlternativas.join(" → ")}
        </div>
      )}
    </div>
  );
}
