import { useEffect, useState } from "react";
import Download from "./components/Download.jsx";
import Flow from "./components/Flow.jsx";
import GeneralConfig from "./components/GeneralConfig.jsx";
import PreviewPanel from "./components/PreviewPanel.jsx";
import SectionConfig from "./components/SectionConfig.jsx";
import Summary from "./components/Summary.jsx";
import Upload from "./components/Upload.jsx";
import { processarPlanilha, analisarPlanilha } from "./services/processingService.js";
import { limparNomeArquivo } from "./utils/fileNameUtils.js";

export default function App() {
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
    setArquivo(file);
    setErrors((prev) => ({ ...prev, arquivo: undefined }));
  }

  return (
    <>
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

          <div className="topbar-meta">
            <span className="topbar-meta-tag">Online</span>
            Processamento <strong>100% no navegador</strong>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            Organizador de Planilhas
          </span>
          <h1 className="hero-title">
            Organizador de Planilhas para Disparos<br />
            <span className="hl">IntegraAiCom</span>
          </h1>
          <p className="hero-sub">
            Mande sua planilha que será organizada de acordo com os padrões do IntegraAiCom.
            Selecione as colunas de <strong>nome</strong> e <strong>número</strong> e separa em arquivos prontos pro disparo.
          </p>

          <Flow arquivo={arquivo} processando={processando} resultado={resultado} />
        </section>

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
