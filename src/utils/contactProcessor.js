import { detectarMapeamentoCabecalho, PALAVRAS_NOME } from "./columnDetector.js";
import { limparNomeContato, limparNomeGrupo, linhaVazia, textoTemPalavra } from "./fileNameUtils.js";

function encontrarIndicePorHeader(linha, headerAlvo) {
  if (!headerAlvo) return -1;
  return linha.findIndex((cel) => String(cel ?? "").trim() === headerAlvo);
}

function resolverNumeroComFallback(linha, mapeamento) {
  const principal = String(linha[mapeamento.colunaNumero] ?? "").replace(/\D/g, "");
  if (principal) return { numero: principal, colunaUsada: mapeamento.colunaNumeroHeader };

  for (const alt of mapeamento.alternativas) {
    const val = String(linha[alt.indice] ?? "").replace(/\D/g, "");
    if (val) return { numero: val, colunaUsada: alt.header };
  }

  return { numero: "", colunaUsada: mapeamento.colunaNumeroHeader };
}

function aplicarDDD(numero, rawDDD) {
  if (!numero) return "";
  if (rawDDD != null) {
    const ddd = String(rawDDD).replace(/\D/g, "");
    if (numero.length < 10 && ddd) return ddd + numero;
  }
  return numero;
}

export function extrairContatosDaAba(dados, nomeAba, colunaNomeHeader, colunaNumeroHeader, separarPorSecoes, colunaDDDHeader, colunasAlternativas = [], colunasParaDuplicar = [], colunaEmpresaHeader = null, colunaCnpjHeader = null) {
  const validos = [];
  const invalidos = [];
  let linhasLidas = 0;
  let secoes = 0;
  let mapeamento = null;
  let encontrouCabecalho = false;
  const grupoBase = separarPorSecoes ? limparNomeGrupo(nomeAba, "Geral") : "Geral";
  const grupos = new Set();

  for (let indice = 0; indice < dados.length; indice++) {
    const linha = dados[indice] || [];
    if (linhaVazia(linha)) continue;

    // Detecta linha de cabeçalho: contém o header de nome OU o header de número selecionado
    const ehCabecalho =
      linha.some((cel) => String(cel ?? "").trim() === colunaNomeHeader) ||
      linha.some((cel) => String(cel ?? "").trim() === colunaNumeroHeader);

    if (ehCabecalho) {
      const idxNome = encontrarIndicePorHeader(linha, colunaNomeHeader);
      const idxNumero = encontrarIndicePorHeader(linha, colunaNumeroHeader);
      const idxDDD = encontrarIndicePorHeader(linha, colunaDDDHeader);

      if (idxNome >= 0 && idxNumero >= 0) {
        const alternativas = colunasAlternativas
          .map((h) => ({ header: h, indice: encontrarIndicePorHeader(linha, h) }))
          .filter((a) => a.indice >= 0);
        const duplicar = colunasParaDuplicar
          .map((h) => ({ header: h, indice: encontrarIndicePorHeader(linha, h) }))
          .filter((a) => a.indice >= 0);
        const idxEmpresa = encontrarIndicePorHeader(linha, colunaEmpresaHeader);
        const idxCnpj = encontrarIndicePorHeader(linha, colunaCnpjHeader);
        mapeamento = {
          colunaNome: idxNome,
          colunaNumero: idxNumero,
          colunaNumeroHeader,
          colunaDDD: idxDDD,
          alternativas,
          duplicar,
          colunaEmpresa: idxEmpresa,
          colunaCnpj: idxCnpj,
        };
        encontrouCabecalho = true;
        grupos.add(grupoBase);
        secoes += 1;
      }
      continue;
    }

    if (!mapeamento) continue;

    const nomeOriginal = linha[mapeamento.colunaNome];
    const rawDDD = mapeamento.colunaDDD >= 0 ? linha[mapeamento.colunaDDD] : null;
    const { numero } = resolverNumeroComFallback(linha, mapeamento);
    const name = limparNomeContato(nomeOriginal);
    const number = aplicarDDD(numero, rawDDD);

    linhasLidas++;

    if (!name) {
      invalidos.push({
        name,
        number,
        motivo: "Nome vazio",
        aba: nomeAba,
        secao: grupoBase,
        linha: indice + 1,
      });
      continue;
    }

    if (!number) {
      invalidos.push({
        name,
        number,
        motivo: "Número vazio",
        aba: nomeAba,
        secao: grupoBase,
        linha: indice + 1,
      });
      continue;
    }

    const empresa = mapeamento.colunaEmpresa >= 0 ? String(linha[mapeamento.colunaEmpresa] ?? "").trim() : undefined;
    const cnpj = mapeamento.colunaCnpj >= 0 ? String(linha[mapeamento.colunaCnpj] ?? "").trim() : undefined;
    validos.push({ name, number, grupo: grupoBase, aba: nomeAba, linha: indice + 1, empresa, cnpj });
    grupos.add(grupoBase);

    if (mapeamento.duplicar.length > 0) {
      for (const col of mapeamento.duplicar) {
        const numAlt = aplicarDDD(String(linha[col.indice] ?? "").replace(/\D/g, ""), rawDDD);
        if (numAlt) {
          validos.push({ name: `${name} (${col.header})`, number: numAlt, grupo: grupoBase, aba: nomeAba, linha: indice + 1 });
        }
      }
    }
  }

  // Fallback: se não detectou cabeçalho mas a primeira linha parece ter nome/número
  if (!encontrouCabecalho && dados.length >= 2) {
    const cabecalho = dados[0] || [];
    const primeiraColunaPareceNome = textoTemPalavra(cabecalho[0], PALAVRAS_NOME);
    const segundaColunaPareceNumero = textoTemPalavra(cabecalho[1], ["number", "numero", "número", "telefone", "fone", "celular", "whatsapp"]);

    if (primeiraColunaPareceNome || segundaColunaPareceNumero) {
      for (let indice = 1; indice < dados.length; indice++) {
        const linha = dados[indice] || [];
        if (linhaVazia(linha)) continue;

        const name = limparNomeContato(linha[0]);
        const number = montarNumero(linha[1], null);

        linhasLidas++;

        if (!name) {
          invalidos.push({ name, number, motivo: "Nome vazio", aba: nomeAba, secao: grupoBase, linha: indice + 1 });
          continue;
        }

        if (!number) {
          invalidos.push({ name, number, motivo: "Número vazio", aba: nomeAba, secao: grupoBase, linha: indice + 1 });
          continue;
        }

        validos.push({ name, number, grupo: grupoBase, aba: nomeAba, linha: indice + 1 });
        grupos.add(grupoBase);
      }
      secoes = 1;
    }
  }

  return {
    contatosValidos: validos,
    contatosInvalidos: invalidos,
    linhasLidas,
    secoesEncontradas: secoes,
    gruposEncontrados: grupos.size,
  };
}

export function removerDuplicados(contatos, separarPorSecoes) {
  const encontrados = new Map();
  const unicos = [];
  const duplicados = [];

  contatos.forEach((contato) => {
    const chave = separarPorSecoes ? `${contato.grupo}::${contato.number}` : contato.number;

    if (encontrados.has(chave)) {
      duplicados.push({
        name: contato.name,
        number: contato.number,
        motivo: "Numero duplicado",
        aba: contato.aba,
        secao: contato.grupo || "Geral",
        linha: contato.linha,
      });
      return;
    }

    encontrados.set(chave, true);
    const unico = {
      name: contato.name,
      number: contato.number,
      grupo: separarPorSecoes ? contato.grupo || "Geral" : "Geral",
    };
    if (contato.empresa != null) unico.empresa = contato.empresa;
    if (contato.cnpj != null) unico.cnpj = contato.cnpj;
    unicos.push(unico);
  });

  return { unicos, duplicados };
}
