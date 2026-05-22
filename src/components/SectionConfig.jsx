export default function SectionConfig({ modoDivisao, podeSecoes, analise, configSecoes, quantidade, onConfigSecoesChange }) {
  if (modoDivisao !== "secoes" || !podeSecoes) return null;

  return (
    <div className="secoes">
      <div className="secoes-head">
        <strong>Configuração por seção</strong>
        <span>Cada aba pode ter sua própria quantidade, virar arquivo único ou ser excluída do ZIP.</span>
      </div>
      <div className="secoes-list">
        {analise.grupos.map((grupo) => {
          const config = configSecoes[grupo] || { dividir: true, quantidade, auto: true, excluir: false };

          return (
            <div className={`secao-row${config.excluir ? " secao-excluida" : ""}`} key={grupo}>
              <div className="secao-name" title={grupo}>{grupo}</div>
              <div className="secao-controls">
                <label className="secao-toggle">
                  <input
                    type="checkbox"
                    checked={config.dividir}
                    onChange={(event) => {
                      const dividir = event.target.checked;
                      onConfigSecoesChange((prev) => ({
                        ...prev,
                        [grupo]: { ...config, dividir, excluir: dividir ? false : true },
                      }));
                    }}
                  />
                  <span>Dividir</span>
                </label>

                <input
                  type="number"
                  min="1"
                  disabled={!config.dividir}
                  value={config.quantidade}
                  onChange={(event) => onConfigSecoesChange((prev) => ({
                    ...prev,
                    [grupo]: {
                      ...config,
                      quantidade: parseInt(event.target.value, 10) || 0,
                      auto: false,
                    },
                  }))}
                  className="secao-qty"
                />

                <label className={`secao-toggle secao-excluir-toggle${config.dividir ? " is-locked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={config.excluir}
                    disabled={config.dividir}
                    onChange={(event) => onConfigSecoesChange((prev) => ({
                      ...prev,
                      [grupo]: { ...config, excluir: event.target.checked },
                    }))}
                  />
                  <span>Excluir</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
