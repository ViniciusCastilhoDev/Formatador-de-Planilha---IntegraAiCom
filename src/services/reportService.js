import { criarRelatorioXlsx } from "./excelService.js";
import { adicionarArquivoTabela } from "./zipService.js";

export function adicionarRelatorios(zip, { baseTitulo, invalidos, duplicados, formato, resumo }) {
  if (invalidos.length > 0) {
    adicionarArquivoTabela(zip, `relatorios/${baseTitulo}_contatos_invalidos`, invalidos, formato, true);
  }

  if (duplicados.length > 0) {
    adicionarArquivoTabela(zip, `relatorios/${baseTitulo}_duplicados_removidos`, duplicados, formato, true);
  }

  zip.file(`relatorios/${baseTitulo}_relatorio.xlsx`, criarRelatorioXlsx(criarLinhasRelatorio(resumo)));
}

function criarLinhasRelatorio({
  abasLidas,
  totalSecoes,
  separarPorSecoes,
  nomesPastas,
  secoesExcluidas,
  regras,
  quantidade,
  totalLinhas,
  validos,
  invalidos,
  duplicados,
  totalArquivos,
  formato,
  colunaNome,
  colunaNumero,
}) {
  return [
    ["Item", "Quantidade"],
    ["Abas lidas", abasLidas],
    ["Seções detectadas", totalSecoes],
    ["Modo de divisão", separarPorSecoes ? "Separado por abas/seções" : "Geral"],
    ["Pastas de saída", nomesPastas.length],
    ["Pastas", nomesPastas.join(", ")],
    ["Seções excluídas do ZIP", secoesExcluidas.length > 0 ? secoesExcluidas.join(", ") : "Nenhuma"],
    ["Configuração das seções", separarPorSecoes ? Object.values(regras).map((regra) => regra.descricao).join(" | ") : `Geral: ${quantidade} por arquivo`],
    ["Linhas analisadas", totalLinhas],
    ["Contatos válidos finais", validos],
    ["Contatos inválidos", invalidos],
    ["Duplicados removidos", duplicados],
    ["Arquivos de disparo gerados", totalArquivos],
    ["Formato", formato.toUpperCase()],
    ["Coluna de nome usada", colunaNome || "—"],
    ["Coluna de número usada", colunaNumero || "—"],
  ];
}
