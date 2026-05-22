import * as XLSX from "xlsx";

export async function lerWorkbook(arquivo) {
  const buffer = await arquivo.arrayBuffer();
  return XLSX.read(buffer, { type: "array" });
}

export function worksheetToRows(worksheet) {
  return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", raw: false });
}

export function tabelaParaArquivo(dados, formato, incluirMotivo = false) {
  if (formato === "xlsx") {
    const header = incluirMotivo ? ["name", "number", "dddOriginal", "motivo", "aba", "secao", "linha"] : ["name", "number"];
    const worksheet = XLSX.utils.json_to_sheet(dados, { header });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contatos");
    return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  }

  return converterParaCSV(dados, incluirMotivo);
}

export function criarRelatorioXlsx(linhas) {
  const worksheet = XLSX.utils.aoa_to_sheet(linhas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
  return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
}

function converterParaCSV(dados, incluirMotivo = false) {
  const cabecalho = incluirMotivo ? "name;number;dddOriginal;motivo;aba;secao;linha" : "name;number";
  const linhas = dados.map((item) => {
    const name = escaparCsv(item.name);
    const number = escaparCsv(item.number);

    if (!incluirMotivo) return `"${name}";"${number}"`;

    const dddOriginal = escaparCsv(item.dddOriginal);
    const motivo = escaparCsv(item.motivo);
    const aba = escaparCsv(item.aba);
    const secao = escaparCsv(item.secao ?? item.grupo);
    const linha = escaparCsv(item.linha);
    return `"${name}";"${number}";"${dddOriginal}";"${motivo}";"${aba}";"${secao}";"${linha}"`;
  });

  return `${cabecalho}\n${linhas.join("\n")}`;
}

function escaparCsv(valor) {
  return String(valor ?? "").replace(/"/g, '""');
}
