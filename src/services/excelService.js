import * as XLSX from "xlsx";

export async function lerWorkbook(arquivo) {
  const buffer = await arquivo.arrayBuffer();
  return XLSX.read(buffer, { type: "array" });
}

export function worksheetToRows(worksheet) {
  return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", raw: false });
}

export function tabelaParaArquivo(dados, formato, incluirMotivo = false, camposExtras = []) {
  if (formato === "xlsx") {
    const header = incluirMotivo
      ? ["name", "number", ...camposExtras, "dddOriginal", "motivo", "aba", "secao", "linha"]
      : ["name", "number", ...camposExtras];
    const worksheet = XLSX.utils.json_to_sheet(dados, { header });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contatos");
    return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  }

  return converterParaCSV(dados, incluirMotivo, camposExtras);
}

export function criarRelatorioXlsx(linhas) {
  const worksheet = XLSX.utils.aoa_to_sheet(linhas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
  return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
}

function converterParaCSV(dados, incluirMotivo = false, camposExtras = []) {
  const colsBase = ["name", "number", ...camposExtras];
  const cabecalho = incluirMotivo
    ? `${colsBase.join(";")};dddOriginal;motivo;aba;secao;linha`
    : colsBase.join(";");

  const linhas = dados.map((item) => {
    const base = colsBase.map((col) => `"${escaparCsv(item[col])}"`).join(";");
    if (!incluirMotivo) return base;

    const dddOriginal = escaparCsv(item.dddOriginal);
    const motivo = escaparCsv(item.motivo);
    const aba = escaparCsv(item.aba);
    const secao = escaparCsv(item.secao ?? item.grupo);
    const linha = escaparCsv(item.linha);
    return `${base};"${dddOriginal}";"${motivo}";"${aba}";"${secao}";"${linha}"`;
  });

  return `${cabecalho}\n${linhas.join("\n")}`;
}

function escaparCsv(valor) {
  return String(valor ?? "").replace(/"/g, '""');
}
