import { linhaVazia, limparNomeGrupo } from "./fileNameUtils.js";
import { worksheetToRows } from "../services/excelService.js";

export function detectarPlanilhaComSecoes(workbook) {
  const abas = [];

  workbook.SheetNames.forEach((nomeAba) => {
    const worksheet = workbook.Sheets[nomeAba];
    const dados = worksheetToRows(worksheet);
    const temDados = dados.some((linha) => !linhaVazia(linha || []));

    if (temDados) abas.push(limparNomeGrupo(nomeAba, "Geral"));
  });

  return { temSecoes: abas.length > 1, abas, grupos: abas };
}

export function agruparContatosPorGrupo(contatos) {
  return contatos.reduce((acc, contato) => {
    const grupo = contato.grupo || "Geral";
    if (!acc[grupo]) acc[grupo] = [];
    const item = { name: contato.name, number: contato.number };
    if (contato.empresa != null) item.empresa = contato.empresa;
    if (contato.cnpj != null) item.cnpj = contato.cnpj;
    acc[grupo].push(item);
    return acc;
  }, {});
}

export function obterRegraDivisao(nomeGrupo, contatosDoGrupo, quantidadePadrao, configSecoes, separarPorSecoes) {
  if (!separarPorSecoes) {
    return {
      dividir: true,
      quantidade: quantidadePadrao,
      excluir: false,
      descricao: `${nomeGrupo}: ${quantidadePadrao} por arquivo`,
    };
  }

  const nomeLimpo = limparNomeGrupo(nomeGrupo, "Secao");
  const config = configSecoes[nomeLimpo] || configSecoes[nomeGrupo] || {
    dividir: true,
    quantidade: quantidadePadrao,
  };
  const excluir = config.dividir === false && config.excluir === true;

  if (config.dividir === false) {
    return {
      dividir: false,
      quantidade: Math.max(contatosDoGrupo.length, 1),
      excluir,
      descricao: `${nomeLimpo}: ${excluir ? "excluído do ZIP" : "arquivo único"}`,
    };
  }

  const quantidade = config.quantidade && config.quantidade > 0 ? config.quantidade : quantidadePadrao;
  return {
    dividir: true,
    quantidade,
    excluir: false,
    descricao: `${nomeLimpo}: ${quantidade} por arquivo`,
  };
}
