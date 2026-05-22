import { linhaVazia, normalizarTexto, textoTemPalavra } from "./fileNameUtils.js";

export const PALAVRAS_NOME = [
  "name", "nome", "cliente", "razao", "razao social", "razão", "razão social",
  "fantasia", "nome fantasia", "contato", "pessoa", "empresa", "comprador",
];

const PALAVRAS_NUMERO = [
  "number", "numero", "número", "telefone", "telef", "fone", "celular", "celula", "cel", "whatsapp",
  "whats", "zap", "tel", "mobile",
];

const PALAVRAS_IGNORAR_NUMERO = ["cpf", "cnpj", "cep"];

const PALAVRAS_GRUPO = [
  "vendedor", "consultor", "responsavel", "responsável", "atendente", "representante",
  "usuario", "usuário", "colaborador", "equipe", "setor", "grupo", "secao", "seção",
];

// Palavras que indicam que uma célula é um cabeçalho de coluna real
const PALAVRAS_CABECALHO_CONHECIDAS = [
  "name", "nome", "cliente", "razao", "fantasia", "contato", "pessoa", "empresa", "comprador",
  "number", "numero", "telefone", "telef", "fone", "celular", "cel", "whatsapp", "whats", "zap", "mobile",
  "cnpj", "cpf", "documento", "endereco", "cidade", "bairro", "cep", "uf", "estado",
  "data", "valor", "total", "codigo", "cod", "observacao", "email",
  "vendedor", "consultor", "responsavel", "atendente", "representante", "colaborador", "equipe", "setor",
  "ddd", "cod area", "grupo", "secao",
];

function pontuarColunaNome(cabecalho) {
  const texto = normalizarTexto(cabecalho);
  if (!texto) return 0;
  if (texto === "name" || texto === "nome") return 100;
  if (texto.includes("razao") || texto.includes("cliente")) return 95;
  if (texto.includes("fantasia") || texto.includes("empresa")) return 85;
  if (textoTemPalavra(texto, PALAVRAS_NOME)) return 70;
  return 0;
}

function pontuarColunaNumero(cabecalho) {
  const texto = normalizarTexto(cabecalho);
  if (!texto) return 0;
  if (PALAVRAS_IGNORAR_NUMERO.some((p) => texto.includes(p))) return 0;
  if (texto === "number" || texto === "numero" || texto === "número") return 100;
  if (texto.includes("whatsapp") || texto.includes("whats") || texto.includes("zap")) return 95;
  if (texto.includes("celular") || texto.includes("cel") || texto.includes("mobile")) return 90;
  if (textoTemPalavra(texto, PALAVRAS_NUMERO)) return 70;
  return 0;
}

function pontuarColunaGrupo(cabecalho) {
  const texto = normalizarTexto(cabecalho);
  if (!texto) return 0;
  if (texto === "vendedor" || texto === "responsavel" || texto === "responsável") return 100;
  if (textoTemPalavra(texto, PALAVRAS_GRUPO)) return 80;
  return 0;
}

function celulaPareceHeaderConhecido(celula) {
  const texto = normalizarTexto(celula);
  if (!texto || texto.length > 60) return false;
  // Rejeita valores que claramente são dados (apenas dígitos, datas brutas, valores monetários)
  if (/^\d+([.,]\d+)?$/.test(String(celula ?? "").trim())) return false;
  return PALAVRAS_CABECALHO_CONHECIDAS.some((palavra) => texto.includes(normalizarTexto(palavra)));
}

function pontuarLinhaComoCabecalho(linha) {
  let reconhecidas = 0;
  for (const cel of linha) {
    if (celulaPareceHeaderConhecido(cel)) reconhecidas++;
  }
  return reconhecidas;
}

// Varre as primeiras `limite` linhas e retorna o índice da que mais parece cabeçalho real (score >= 2).
export function encontrarLinhaCabecalho(dados, limite = 25) {
  let melhorIndice = -1;
  let melhorScore = 1; // exige pelo menos score > 1 (ou seja, >= 2)

  const max = Math.min(dados.length, limite);
  for (let i = 0; i < max; i++) {
    const linha = dados[i] || [];
    if (linhaVazia(linha)) continue;
    const score = pontuarLinhaComoCabecalho(linha);
    if (score > melhorScore) {
      melhorScore = score;
      melhorIndice = i;
    }
  }

  return melhorIndice;
}

export function detectarMapeamentoCabecalho(linha) {
  let colunaNome = -1;
  let maiorNome = 0;
  let colunaNumero = -1;
  let maiorNumero = 0;
  let colunaGrupo = -1;
  let maiorGrupo = 0;

  linha.forEach((celula, indice) => {
    const scoreNome = pontuarColunaNome(celula);
    const scoreNumero = pontuarColunaNumero(celula);
    const scoreGrupo = pontuarColunaGrupo(celula);

    if (scoreNome > maiorNome) { maiorNome = scoreNome; colunaNome = indice; }
    if (scoreNumero > maiorNumero) { maiorNumero = scoreNumero; colunaNumero = indice; }
    if (scoreGrupo > maiorGrupo) { maiorGrupo = scoreGrupo; colunaGrupo = indice; }
  });

  if (colunaNome >= 0 && colunaNumero >= 0) {
    return {
      colunaNome,
      colunaNumero,
      colunaGrupo,
      nomeHeader: String(linha[colunaNome] ?? "").trim(),
      numeroHeader: String(linha[colunaNumero] ?? "").trim(),
      cabecalho: linha,
    };
  }

  return null;
}

export function pareceLinhaDeCabecalho(linha) {
  return Boolean(detectarMapeamentoCabecalho(linha));
}

export function temDadosNaLinha(linha) {
  return !linhaVazia(linha);
}

// Retorna os valores de cabeçalho da linha que mais parece ser cabeçalho real.
export function coletarCabecalhosDaAba(dados) {
  const indiceCabecalho = encontrarLinhaCabecalho(dados);
  if (indiceCabecalho < 0) return [];

  const linha = dados[indiceCabecalho] || [];
  return linha.map((cel) => String(cel ?? "").trim()).filter(Boolean);
}

// ── Detecção de colunas de número para fallback ──────────────────────────────

const FORTES_TELEFONE = ["whatsapp", "whats", "zap", "celular", "telefone", "telef", "fone"];
const AMBIGUOS_TELEFONE = ["numero", "number", "contato"];
const BLACKLIST_FALLBACK = [
  "cpf", "cnpj", "codigo", "cod", "documento", "doc", "venda", "valor",
  "data", "bairro", "cidade", "vendedor", "cep", "uf", "estado", "email",
  "nota", "protocolo", "pedido", "nf", "nº", "n°",
];

function prioridadeColunaTelefone(norm) {
  if (norm.includes("whatsapp") || norm.includes("whats") || norm.includes("zap")) return 1;
  if (norm.includes("celular")) return 2;
  if (norm.includes("telefone") || norm.includes("telef") || norm.includes("fone")) return 3;
  return 4;
}

function valorPareceTelefone(valor) {
  const d = String(valor ?? "").replace(/\D/g, "");
  return d.length >= 8 && d.length <= 13;
}

function headerNaBlacklist(norm) {
  return BLACKLIST_FALLBACK.some((b) => norm.includes(b));
}

/**
 * Retorna todos os cabeçalhos que parecem colunas de telefone, ordenados por prioridade.
 * linhasData: array de objetos {header: valor} das linhas de dados (para validação de colunas ambíguas).
 */
export function detectarColunasNumero(cabecalhos, linhasData) {
  const candidatas = [];

  for (const header of cabecalhos) {
    const norm = normalizarTexto(header);
    if (!norm) continue;
    if (headerNaBlacklist(norm)) continue;

    let aceita = false;
    let pri = 99;

    if (FORTES_TELEFONE.some((f) => norm.includes(f))) {
      aceita = true;
      pri = prioridadeColunaTelefone(norm);
    } else if (AMBIGUOS_TELEFONE.some((a) => norm === a)) {
      const valores = linhasData
        .map((row) => row[header])
        .filter((v) => v != null && String(v).trim() !== "");
      if (valores.length > 0 && valores.filter(valorPareceTelefone).length / valores.length >= 0.6) {
        aceita = true;
        pri = 4;
      }
    }

    if (aceita) candidatas.push({ header, pri });
  }

  return candidatas
    .sort((a, b) => a.pri - b.pri || cabecalhos.indexOf(a.header) - cabecalhos.indexOf(b.header))
    .map((c) => c.header);
}
