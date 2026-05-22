import JSZip from "jszip";
import { tabelaParaArquivo } from "./excelService.js";

export function criarZip() {
  return new JSZip();
}

export function adicionarArquivoTabela(zip, nome, dados, formato, incluirMotivo = false) {
  const extensao = formato === "xlsx" ? "xlsx" : "csv";
  zip.file(`${nome}.${extensao}`, tabelaParaArquivo(dados, formato, incluirMotivo));
}

export async function gerarZipBlob(zip) {
  return zip.generateAsync({ type: "blob" });
}

export function baixarBlob(blob, nomeArquivo) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
