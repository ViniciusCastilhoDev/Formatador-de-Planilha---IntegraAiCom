import Tooltip from "./Tooltip.jsx";

export default function GeneralConfig({
  quantidade,
  formato,
  colunaNome,
  colunaNumero,
  modoDivisao,
  arquivo,
  analisando,
  analise,
  podeSecoes,
  errors,
  adicionarDDD,
  colunaDDD,
  onQuantidadeChange,
  onFormatoChange,
  onColunaNomeChange,
  onColunaNumeroChange,
  onModoDivisaoChange,
  onAdicionarDDDChange,
  onColunaDDDChange,
}) {
  const cabecalhos = analise?.cabecalhos || [];
  const mostrarSelects = arquivo && !analisando && cabecalhos.length > 0;

  return (
    <>
      {/* ── Configurações básicas ── */}
      <div className="form-section">
        <p className="form-section-title">Configurações</p>
        <div className="row">
          <div className={`input ${errors.quantidade ? "has-error" : ""}`}>
            <label>
              Por arquivo
              <Tooltip text="Quantos contatos devem ir em cada arquivo gerado. Ex: 50 gera arquivos com até 50 contatos cada, prontos para disparo." />
            </label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(event) => onQuantidadeChange(parseInt(event.target.value, 10) || 0)}
            />
            {errors.quantidade && <div className="field-error">{errors.quantidade}</div>}
          </div>

          <div className="input">
            <label>
              Formato de saída
              <Tooltip text="Formato dos arquivos gerados. Excel (.xlsx) é o mais compatível com ferramentas de disparo. CSV é aceito por sistemas mais simples." />
            </label>
            <div className="custom-select">
              <select value={formato} onChange={(event) => onFormatoChange(event.target.value)}>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mapeamento de colunas ── */}
      {mostrarSelects && (
        <div className="form-section">
          <p className="form-section-title">Mapeamento</p>
          <div className="row">
            <div className={`input ${errors.colunaNome ? "has-error" : ""}`}>
              <label>
                Coluna de nome
                <Tooltip text="Qual coluna da planilha contém o nome do contato. A detecção é automática, mas você pode escolher manualmente." />
              </label>
              <div className="custom-select">
                <select value={colunaNome} onChange={(event) => onColunaNomeChange(event.target.value)}>
                  <option value="">— Selecione —</option>
                  {cabecalhos.map((header) => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
              {errors.colunaNome && <div className="field-error">{errors.colunaNome}</div>}
            </div>

            <div className={`input ${errors.colunaNumero ? "has-error" : ""}`}>
              <label>
                Coluna de número
                <Tooltip text="Qual coluna da planilha contém o número de telefone." />
              </label>
              <div className="custom-select">
                <select value={colunaNumero} onChange={(event) => onColunaNumeroChange(event.target.value)}>
                  <option value="">— Selecione —</option>
                  {cabecalhos.map((header) => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
              {errors.colunaNumero && <div className="field-error">{errors.colunaNumero}</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── Complemento de DDD ── */}
      {mostrarSelects && analise?.colunaDDDDetectada && (
        <div className="form-section">
          <p className="form-section-title">Complemento de DDD</p>
          <div className="ddd-config">
            <label className="ddd-check-label">
              <input
                type="checkbox"
                checked={adicionarDDD}
                onChange={(e) => onAdicionarDDDChange(e.target.checked)}
              />
              <span>Adicionar DDD ao número</span>
            </label>

            {adicionarDDD && (
              <div className="input ddd-select-wrap">
                <label>
                  Coluna de DDD
                  <Tooltip text="Qual coluna contém o DDD a ser adicionado antes do número. Se o número já tiver 10 ou mais dígitos, o DDD é ignorado." />
                </label>
                <div className="custom-select">
                  <select value={colunaDDD} onChange={(e) => onColunaDDDChange(e.target.value)}>
                    <option value="">— Selecione —</option>
                    {cabecalhos.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Divisão ── */}
      <div className="form-section">
        <p className="form-section-title">Divisão</p>
        <div className="input">
          <label>
            Como dividir a planilha?
            <Tooltip text="'Geral' junta contatos de todas as abas e divide pela quantidade definida. 'Por abas' mantém cada aba separada em sua própria pasta dentro do ZIP." />
          </label>
          <div className="custom-select">
            <select value={modoDivisao} onChange={(event) => onModoDivisaoChange(event.target.value)}>
              <option value="geral">Juntar todos os contatos e dividir por quantidade</option>
              <option value="secoes" disabled={!podeSecoes}>Manter separado por abas/seções</option>
            </select>
          </div>
          <small className={`help ${podeSecoes ? "is-ok" : ""}`}>{criarAjudaModo({ arquivo, analisando, analise, podeSecoes })}</small>
        </div>
      </div>
    </>
  );
}

function criarAjudaModo({ arquivo, analisando, analise, podeSecoes }) {
  if (!arquivo) return "A opção por seção é liberada quando a planilha tem mais de uma aba com dados.";
  if (analisando) return "Analisando abas da planilha...";
  if (podeSecoes) {
    const primeirasAbas = analise.abas.slice(0, 4).join(", ");
    const restantes = analise.abas.length > 4 ? `… (+${analise.abas.length - 4})` : "";
    return `Detectei ${analise.abas.length} abas: ${primeirasAbas}${restantes}. Divisão por abas liberada.`;
  }
  return "Esta planilha tem apenas uma aba com dados — a divisão será feita no modo geral.";
}
