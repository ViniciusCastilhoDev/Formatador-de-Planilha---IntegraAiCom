function apenasNumeros(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

function limparDDD(ddd) {
  let limpo = apenasNumeros(ddd);

  if (limpo.startsWith("55") && limpo.length > 2) {
    limpo = limpo.slice(2);
  }

  while (limpo.startsWith("0") && limpo.length > 2) {
    limpo = limpo.slice(1);
  }

  if (limpo.length > 2) {
    limpo = limpo.slice(-2);
  }

  return limpo;
}

function criarResultadoInvalido(motivo, number = "") {
  return { valido: false, number, motivo };
}

function deveAdicionarNonoDigito(numeroLocal) {
  if (numeroLocal.length !== 8) return false;
  return /^[6-9]/.test(numeroLocal);
}

export function formatarNumeroWhatsApp(numeroBruto, dddBruto = "", dddPadrao = "", forcarNonoDigito = true) {
  let numero = apenasNumeros(numeroBruto);
  let ddd = limparDDD(dddBruto || dddPadrao);

  if (!numero) {
    return criarResultadoInvalido("Numero vazio");
  }

  while (numero.startsWith("0") && numero.length > 8) {
    numero = numero.slice(1);
  }

  if (numero.startsWith("55")) {
    numero = numero.slice(2);
  }

  if (numero.length === 10 || numero.length === 11) {
    ddd = limparDDD(numero.slice(0, 2));
    numero = numero.slice(2);
  }

  if (!ddd || ddd.length !== 2) {
    return criarResultadoInvalido("DDD ausente ou invalido");
  }

  while (numero.startsWith("0") && numero.length > 8) {
    numero = numero.slice(1);
  }

  if (forcarNonoDigito && deveAdicionarNonoDigito(numero)) {
    numero = `9${numero}`;
  }

  if (numero.length === 9 && forcarNonoDigito && !numero.startsWith("9")) {
    numero = `9${numero.slice(-8)}`;
  }

  if (numero.length !== 8 && numero.length !== 9) {
    return criarResultadoInvalido(`Numero local invalido: ${numero}`);
  }

  const final = `55${ddd}${numero}`;

  if (!/^55\d{2}\d{8,9}$/.test(final)) {
    return criarResultadoInvalido(`Formato final invalido: ${final}`);
  }

  return {
    valido: true,
    number: final,
    motivo: "OK",
  };
}
