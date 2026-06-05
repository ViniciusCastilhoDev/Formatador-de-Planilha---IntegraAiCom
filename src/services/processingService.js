import { extrairContatosDaAba, removerDuplicados } from "../utils/contactProcessor.js";
import { agruparContatosPorGrupo, detectarPlanilhaComSecoes, obterRegraDivisao } from "../utils/sectionProcessor.js";
import { coletarCabecalhosDaAba, detectarColunasNumero, detectarMapeamentoCabecalho, encontrarLinhaCabecalho } from "../utils/columnDetector.js";
import { limparNomeArquivo } from "../utils/fileNameUtils.js";
import { lerWorkbook, worksheetToRows } from "./excelService.js";
import { adicionarRelatorios } from "./reportService.js";
import { adicionarArquivoTabela, baixarBlob, criarZip, gerarZipBlob } from "./zipService.js";

const NOMES_COLUNA_DDD = [
  "ddd", "dd",
  "cod. ddd", "cod ddd", "codigo ddd",
  "codigo de area", "area",
];

function normalizarParaDeteccao(texto) {
  return String(texto ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export async function analisarPlanilha(arquivo) {
  const workbook = await lerWorkbook(arquivo);
  const analise = detectarPlanilhaComSecoes(workbook);

  const todosHeaders = [];
  const headersSet = new Set();
  let primeiroMapeamento = null;
  let linhasAmostra = [];

  for (const nomeAba of workbook.SheetNames) {
    const worksheet = workbook.Sheets[nomeAba];
    const dados = worksheetToRows(worksheet);
    const cabecalhosAba = coletarCabecalhosDaAba(dados);

    cabecalhosAba.forEach((val) => {
      if (!headersSet.has(val)) {
        headersSet.add(val);
        todosHeaders.push(val);
      }
    });

    if (!primeiroMapeamento) {
      const idx = encontrarLinhaCabecalho(dados);
      if (idx >= 0) {
        const mapeamento = detectarMapeamentoCabecalho(dados[idx]);
        if (mapeamento) {
          primeiroMapeamento = mapeamento;
          const headerRow = dados[idx];
          const linhasDeteccao = [];
          for (let r = idx + 1; r < dados.length && linhasDeteccao.length < 100; r++) {
            const row = dados[r] || [];
            if (row.every((c) => c == null || c === "")) continue;
            const rowObj = {};
            headerRow.forEach((cel, colIdx) => {
              const key = String(cel ?? "").trim();
              if (key) rowObj[key] = row[colIdx] != null ? String(row[colIdx]) : "";
            });
            linhasDeteccao.push(rowObj);
            if (linhasDeteccao.length <= 5) linhasAmostra.push(rowObj);
          }
          primeiroMapeamento._linhasDeteccao = linhasDeteccao;
        }
      }
    }
  }

  const colunaDDDDetectada = todosHeaders.find((h) => {
    const norm = normalizarParaDeteccao(h);
    return NOMES_COLUNA_DDD.some((n) => norm === n);
  }) || null;

  const linhasDeteccao = primeiroMapeamento?._linhasDeteccao || linhasAmostra;
  const todasColunasNumero = detectarColunasNumero(todosHeaders, linhasDeteccao);

  return {
    ...analise,
    cabecalhos: todosHeaders,
    colunaNomeDetectada: primeiroMapeamento?.nomeHeader || null,
    colunaNumeroDetectada: primeiroMapeamento?.numeroHeader || null,
    colunaDDDDetectada,
    linhasAmostra,
    todasColunasNumero,
  };
}

export async function processarPlanilha({
  arquivo,
  quantidade,
  titulo,
  formato,
  colunaNome,
  colunaNumero,
  modoDivisao,
  configSecoes,
  onProgress,
  onStatus,
  adicionarDDD,
  colunaDDD,
  todasColunasNumero,
  colunasNumerosAdicionais = [],
}) {
  const workbook = await lerWorkbook(arquivo);
  const analise = detectarPlanilhaComSecoes(workbook);
  let separarPorSecoes = modoDivisao === "secoes";
  if (separarPorSecoes && !analise.temSecoes) separarPorSecoes = false;

  let validos = [];
  let invalidos = [];
  let totalLinhas = 0;
  let totalSecoes = 0;

  const colunasAlternativas = (todasColunasNumero || []).filter((h) => h !== colunaNumero);

  workbook.SheetNames.forEach((nomeAba) => {
    const worksheet = workbook.Sheets[nomeAba];
    const dados = worksheetToRows(worksheet);
    const resultado = extrairContatosDaAba(dados, nomeAba, colunaNome, colunaNumero, separarPorSecoes, adicionarDDD ? colunaDDD : null, colunasAlternativas, colunasNumerosAdicionais);

    validos = validos.concat(resultado.contatosValidos);
    invalidos = invalidos.concat(resultado.contatosInvalidos);
    totalLinhas += resultado.linhasLidas;
    totalSecoes += resultado.secoesEncontradas;
  });

  const { unicos, duplicados } = removerDuplicados(validos, separarPorSecoes);
  const grupos = separarPorSecoes
    ? agruparContatosPorGrupo(unicos)
    : { Geral: unicos.map((contato) => ({ name: contato.name, number: contato.number })) };
  const nomesPastas = Object.keys(grupos).sort((a, b) => a.localeCompare(b, "pt-BR"));

  if (unicos.length === 0) {
    throw new Error(`Nenhum contato válido encontrado. Inválidos: ${invalidos.length}.`);
  }

  const baseTitulo = limparNomeArquivo(titulo) || "contatos";
  const zip = criarZip();
  const regras = {};
  let totalArquivos = 0;

  nomesPastas.forEach((grupo) => {
    const regra = obterRegraDivisao(grupo, grupos[grupo], quantidade, configSecoes || {}, separarPorSecoes);
    regras[grupo] = regra;
    if (!regra.excluir) totalArquivos += Math.ceil(grupos[grupo].length / regra.quantidade);
  });

  if (onStatus) onStatus(`Gerando ${totalArquivos} arquivo(s) em ${nomesPastas.length} pasta(s)...`);

  let feitos = 0;
  for (const grupo of nomesPastas) {
    if (regras[grupo].excluir) continue;

    const contatosDoGrupo = grupos[grupo];
    const nomePasta = limparNomeArquivo(grupo) || "Secao";
    const prefixo = separarPorSecoes ? nomePasta : baseTitulo;
    const pasta = separarPorSecoes ? `${nomePasta}/` : "";
    const quantidadePorArquivo = regras[grupo].quantidade;
    const totalPartes = Math.ceil(contatosDoGrupo.length / quantidadePorArquivo);

    for (let indice = 0; indice < totalPartes; indice++) {
      const parte = contatosDoGrupo.slice(indice * quantidadePorArquivo, (indice + 1) * quantidadePorArquivo);
      adicionarArquivoTabela(zip, `${pasta}${prefixo}_${indice + 1}`, parte, formato, false);
      feitos++;
      if (onProgress) onProgress((feitos / totalArquivos) * 100);
      await new Promise((resolve) => setTimeout(resolve, 12));
    }
  }

  const secoesExcluidas = nomesPastas.filter((grupo) => regras[grupo].excluir);

  adicionarRelatorios(zip, {
    baseTitulo,
    invalidos,
    duplicados,
    formato,
    resumo: {
      abasLidas: workbook.SheetNames.length,
      totalSecoes,
      separarPorSecoes,
      nomesPastas,
      secoesExcluidas,
      regras,
      quantidade,
      totalLinhas,
      validos: unicos.length,
      invalidos: invalidos.length,
      duplicados: duplicados.length,
      totalArquivos,
      formato,
      colunaNome,
      colunaNumero,
    },
  });

  if (onStatus) onStatus("Compactando ZIP...");
  const blob = await gerarZipBlob(zip);
  baixarBlob(blob, `${baseTitulo}_preparados.zip`);

  return {
    abas: workbook.SheetNames.length,
    secoes: totalSecoes,
    grupos: nomesPastas.length,
    linhas: totalLinhas,
    validos: unicos.length,
    invalidos: invalidos.length,
    duplicados: duplicados.length,
    arquivos: totalArquivos,
    formato: formato.toUpperCase(),
    nomesPastas,
    secoesExcluidas,
  };
}
