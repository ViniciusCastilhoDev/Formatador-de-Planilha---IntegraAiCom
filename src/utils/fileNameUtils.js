export function limparNomeArquivo(nome) {
  return String(nome || "").trim().replace(/\s+/g, "_").replace(/[\\/:*?"<>|]/g, "");
}

export function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function textoTemPalavra(texto, palavras) {
  const normalizado = normalizarTexto(texto);
  return palavras.some((palavra) => normalizado.includes(normalizarTexto(palavra)));
}

export function linhaVazia(linha) {
  return !linha || linha.every((celula) => String(celula ?? "").trim() === "");
}

export function limparNomeGrupo(valor, fallback = "Geral") {
  let texto = String(valor || "")
    .replace(/^(vendedor|consultor|respons[aá]vel|atendente|representante|equipe|grupo|se[cç][aã]o)\s*[:\-–—]?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!texto) texto = fallback;
  return texto;
}

export function limparNomeContato(valor) {
  return String(valor ?? "").replace(/\s+/g, " ").trim();
}
