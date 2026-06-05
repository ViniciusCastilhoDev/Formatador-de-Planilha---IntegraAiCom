import { useEffect, useState } from "react";
import Download from "./components/Download.jsx";
import GeneralConfig from "./components/GeneralConfig.jsx";
import PreviewPanel from "./components/PreviewPanel.jsx";
import SectionConfig from "./components/SectionConfig.jsx";
import Summary from "./components/Summary.jsx";
import Upload from "./components/Upload.jsx";
import WorkflowBar from "./components/WorkflowBar.jsx";
import { processarPlanilha, analisarPlanilha } from "./services/processingService.js";
import { limparNomeArquivo } from "./utils/fileNameUtils.js";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [arquivo, setArquivo] = useState(null);
  const [analisando, setAnalisando] = useState(false);
  const [analise, setAnalise] = useState(null);
  const [quantidade, setQuantidade] = useState(50);
  const [titulo, setTitulo] = useState("contatos");
  const [formato, setFormato] = useState("xlsx");
  const [colunaNome, setColunaNome] = useState("");
  const [colunaNumero, setColunaNumero] = useState("");
  const [modoDivisao, setModoDivisao] = useState("geral");
  const [configSecoes, setConfigSecoes] = useState({});
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState({});
  const [adicionarDDD, setAdicionarDDD] = useState(false);
  const [colunaDDD, setColunaDDD] = useState("");
  const [duplicarNumerosAdicionais, setDuplicarNumerosAdicionais] = useState(false);
  const [colunasNumerosAdicionais, setColunasNumerosAdicionais] = useState([]);
  const [colunaEmpresa, setColunaEmpresa] = useState("");
  const [colunaCnpj, setColunaCnpj] = useState("");
  const [arquivoInvalido, setArquivoInvalido] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!arquivo) {
      setAnalise(null);
      setConfigSecoes({});
      setModoDivisao("geral");
      setResultado(null);
      setTitulo("contatos");
      setColunaNome("");
      setColunaNumero("");
      setErrors({});
      setAdicionarDDD(false);
      setColunaDDD("");
      setDuplicarNumerosAdicionais(false);
      setColunasNumerosAdicionais([]);
      setColunaEmpresa("");
      setColunaCnpj("");
      return undefined;
    }

    const nomeSemExtensao = arquivo.name.replace(/\.[^.]+$/, "");
    setTitulo(limparNomeArquivo(nomeSemExtensao) || "contatos");
    let alive = true;

    setAnalisando(true);
    setErro("");
    setErrors({});
    setResultado(null);
    setColunaNome("");
    setColunaNumero("");

    (async () => {
      try {
        const novaAnalise = await analisarPlanilha(arquivo);
        if (!alive) return;

        setAnalise(novaAnalise);
        setColunaNome(novaAnalise.colunaNomeDetectada || "");
        setColunaNumero(novaAnalise.colunaNumeroDetectada || "");
        setColunaDDD(novaAnalise.colunaDDDDetectada || "");
        setColunaEmpresa(novaAnalise.colunaEmpresaDetectada || "");
        setColunaCnpj(novaAnalise.colunaCnpjDetectada || "");

        const configInicial = {};
        (novaAnalise.grupos || []).forEach((grupo) => {
          configInicial[grupo] = { dividir: true, quantidade, auto: true, excluir: false };
        });
        setConfigSecoes(configInicial);

        if (!novaAnalise.temSecoes) setModoDivisao("geral");
      } catch {
        if (alive) setErro("Não foi possível ler a planilha.");
      } finally {
        if (alive) setAnalisando(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [arquivo]);

  useEffect(() => {
    setConfigSecoes((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (next[key].auto) next[key] = { ...next[key], quantidade };
      });
      return next;
    });
  }, [quantidade]);

  const podeSecoes = Boolean(analise && analise.temSecoes);
  const colunasAlternativas = (analise?.todasColunasNumero || []).filter((h) => h !== colunaNumero);

  async function processar() {
    const newErrors = validarCampos({ arquivo, quantidade, analise, colunaNome, colunaNumero });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setErro("");
    setProcessando(true);
    setProgresso(0);
    setStatusMsg("Lendo planilha...");
    setResultado(null);

    const cfgEngine = {};
    Object.entries(configSecoes).forEach(([key, value]) => {
      cfgEngine[key] = { dividir: value.dividir, quantidade: value.quantidade, excluir: value.excluir };
    });

    try {
      const resultadoProcessamento = await processarPlanilha({
        arquivo,
        quantidade,
        titulo,
        formato,
        colunaNome,
        colunaNumero,
        modoDivisao,
        configSecoes: cfgEngine,
        onProgress: setProgresso,
        onStatus: setStatusMsg,
        adicionarDDD,
        colunaDDD,
        todasColunasNumero: analise?.todasColunasNumero || [],
        colunasNumerosAdicionais: duplicarNumerosAdicionais ? colunasNumerosAdicionais : [],
        colunaEmpresa: colunaEmpresa || null,
        colunaCnpj: colunaCnpj || null,
      });

      setResultado(resultadoProcessamento);
      setStatusMsg("ZIP gerado e baixado!");
    } catch (error) {
      setErro(error.message || "Erro ao processar.");
      setStatusMsg("");
    } finally {
      setProcessando(false);
    }
  }

  function onDrop(event) {
    event.preventDefault();
    setDrag(false);
    const file = event.dataTransfer.files[0];
    if (file) selecionarArquivo(file);
  }

  function selecionarArquivo(file) {
    const nome = file.name.toLowerCase();
    const valido = [".xlsx", ".xls", ".csv"].some((ext) => nome.endsWith(ext));
    if (!valido) {
      setArquivoInvalido(file.name);
      return;
    }
    setArquivo(file);
    setErrors((prev) => ({ ...prev, arquivo: undefined }));
  }

  return (
    <>
      {arquivoInvalido && (
        <ModalFormatoInvalido nome={arquivoInvalido} onClose={() => setArquivoInvalido(null)} />
      )}

      <div className="bg-decor">
        <div className="bg-grid" />
        <div className="bg-blob-a" />
        <div className="bg-blob-b" />
      </div>

      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-brand">
            <div className="topbar-logo">
              <img src="/logo.png" alt="IntegraAiCom" />
            </div>
            <div className="topbar-brand-text">
              <strong>IntegraAiCom</strong>
              <span>Preparador de Contatos</span>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="theme-toggle"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <WorkflowBar
          arquivo={arquivo}
          analisando={analisando}
          processando={processando}
          resultado={resultado}
        />

        <section className="grid">
          <div className="form-card">
            <div className="form-head">
              <h3>Configurar preparação</h3>
              <span>Auto-detecta as colunas de nome e número. Você pode ajustar manualmente.</span>
            </div>

            <div className="form-section form-section-first">
              <p className="form-section-title">Arquivo</p>
              <Upload
                arquivo={arquivo}
                analisando={analisando}
                analise={analise}
                drag={drag}
                errors={errors}
                onDragChange={setDrag}
                onDrop={onDrop}
                onArquivoChange={selecionarArquivo}
              />
            </div>

            <GeneralConfig
              quantidade={quantidade}
              formato={formato}
              colunaNome={colunaNome}
              colunaNumero={colunaNumero}
              modoDivisao={modoDivisao}
              arquivo={arquivo}
              analisando={analisando}
              analise={analise}
              podeSecoes={podeSecoes}
              errors={errors}
              adicionarDDD={adicionarDDD}
              colunaDDD={colunaDDD}
              duplicarNumerosAdicionais={duplicarNumerosAdicionais}
              colunasNumerosAdicionais={colunasNumerosAdicionais}
              colunaEmpresa={colunaEmpresa}
              colunaCnpj={colunaCnpj}
              onColunaEmpresaChange={setColunaEmpresa}
              onColunaCnpjChange={setColunaCnpj}
              onQuantidadeChange={(value) => {
                setQuantidade(value);
                setErrors((prev) => ({ ...prev, quantidade: undefined }));
              }}
              onFormatoChange={setFormato}
              onColunaNomeChange={(value) => {
                setColunaNome(value);
                setErrors((prev) => ({ ...prev, colunaNome: undefined }));
              }}
              onColunaNumeroChange={(value) => {
                setColunaNumero(value);
                setErrors((prev) => ({ ...prev, colunaNumero: undefined }));
              }}
              onModoDivisaoChange={setModoDivisao}
              onAdicionarDDDChange={setAdicionarDDD}
              onColunaDDDChange={setColunaDDD}
              onDuplicarNumerosAdicionaisChange={setDuplicarNumerosAdicionais}
              onColunasNumerosAdicionaisChange={setColunasNumerosAdicionais}
            />

            <SectionConfig
              modoDivisao={modoDivisao}
              podeSecoes={podeSecoes}
              analise={analise}
              configSecoes={configSecoes}
              quantidade={quantidade}
              onConfigSecoesChange={setConfigSecoes}
            />

            <div className="form-section form-action">
              {erro && <div className="erro">{erro}</div>}
              <Download processando={processando} progresso={progresso} arquivo={arquivo} onClick={processar} />
            </div>
          </div>

          <div className="side-panel">
            <PreviewPanel
              linhasAmostra={analise?.linhasAmostra || []}
              colunaNome={colunaNome}
              colunaNumero={colunaNumero}
              adicionarDDD={adicionarDDD}
              colunaDDD={colunaDDD}
              colunasAlternativas={colunasAlternativas}
              colunaEmpresa={colunaEmpresa}
              colunaCnpj={colunaCnpj}
            />
            <Summary
              arquivo={arquivo}
              analisando={analisando}
              analise={analise}
              resultado={resultado}
              titulo={titulo}
              processando={processando}
              progresso={progresso}
              statusMsg={statusMsg}
            />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">© {new Date().getFullYear()} <strong>IntegraAiCom</strong> · Organizador de Planilhas</div>
          <div className="footer-right">
            <span className="footer-dot" />
            Dev: <strong>Vinicius Ribeiro Castilho</strong>
          </div>
        </div>
      </footer>
    </>
  );
}

function ModalFormatoInvalido({ nome, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="modal-content">
          <strong className="modal-title" id="modal-title">Formato não suportado</strong>
          <p className="modal-body">
            O arquivo <span className="modal-filename">{nome}</span> não é compatível com o preparador.
          </p>
          <p className="modal-formatos">
            Formatos aceitos: <strong>.xlsx</strong>, <strong>.xls</strong> e <strong>.csv</strong>
          </p>
        </div>
        <button className="btn btn-primary modal-btn" onClick={onClose} autoFocus>
          Entendi
        </button>
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function validarCampos({ arquivo, quantidade, analise, colunaNome, colunaNumero }) {
  const errors = {};
  if (!arquivo) errors.arquivo = "Selecione uma planilha antes de continuar.";
  if (!quantidade || quantidade <= 0) errors.quantidade = "Informe um número válido de contatos por arquivo.";

  if (analise && analise.cabecalhos && analise.cabecalhos.length > 0) {
    if (!colunaNome) errors.colunaNome = "Selecione a coluna de nome.";
    if (!colunaNumero) errors.colunaNumero = "Selecione a coluna de número.";
  }

  return errors;
}
