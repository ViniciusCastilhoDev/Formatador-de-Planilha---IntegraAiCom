# Organizador de Planilhas para Disparos — IntegraAiCom

Ferramenta web standalone (um único arquivo `.html`) para preparar listas de contatos para disparos no WhatsApp. Roda **100% no navegador**, sem necessidade de servidor ou instalação.

---

## O que faz

- Lê planilhas `.xlsx`, `.xls` e `.csv`
- **Auto-detecta** as colunas de nome e número automaticamente
- Formata todos os números no padrão brasileiro: `55 + DDD + 9 + número`
- Remove contatos duplicados
- Divide os contatos em arquivos prontos para disparo
- Gera um `.zip` com os arquivos organizados e relatórios

---

## Funcionalidades

### Configurações do formulário

| Campo | Descrição |
|---|---|
| **Por arquivo** | Quantidade de contatos em cada arquivo gerado |
| **Formato de saída** | Excel (`.xlsx`) ou CSV (`.csv`) |
| **DDD padrão** | Código de área para números que vierem sem DDD |
| **Prioridade do número** | Qual coluna de telefone é usada quando há mais de uma |
| **Modo de divisão** | Geral (une tudo) ou Por abas (mantém separado por aba) |

### Modos de divisão

- **Geral** — junta os contatos de todas as abas e divide pela quantidade definida
- **Por abas/seções** — cada aba da planilha vira uma pasta separada no ZIP, com arquivos nomeados pelo nome da própria seção (ex: `Cailany/Cailany_1.xlsx`)

### Configuração por seção (modo Por abas)

Cada aba pode ser configurada individualmente:
- **Dividir** — divide em múltiplos arquivos pela quantidade definida
- **Arquivo único** — gera um único arquivo com todos os contatos da aba
- **Excluir do ZIP** — a seção é ignorada e não entra no arquivo final

### Validação

Todos os campos obrigatórios são validados antes de gerar. Campos inválidos são destacados visualmente com mensagem de erro.

### Tooltips

Cada campo do formulário tem um botão `?` com explicação do que preencher e por quê.

---

## Estrutura do ZIP gerado

```
contatos_preparados.zip
├── Cailany/
│   ├── Cailany_1.xlsx
│   └── Cailany_2.xlsx
├── Vendas/
│   └── Vendas_1.xlsx
└── relatorios/
    ├── contatos_relatorio.xlsx
    ├── contatos_contatos_invalidos.xlsx
    └── contatos_duplicados_removidos.xlsx
```

No modo **Geral**, os arquivos ficam na raiz do ZIP sem subpastas.

---

## Como usar

1. Abra o arquivo `Organizador IntegraAiCom _standalone_ (1).html` no navegador
2. Arraste ou selecione sua planilha
3. Configure as opções (quantidade, DDD, formato, modo de divisão)
4. Clique em **Preparar e baixar ZIP**

Não requer internet após o carregamento da página. Todo o processamento acontece localmente no navegador.

---

## Tecnologias

- **React** + Babel standalone
- **SheetJS (XLSX)** — leitura e escrita de planilhas
- **JSZip** — geração do arquivo ZIP
- **Plus Jakarta Sans** + **Space Grotesk** — tipografia

---

## Desenvolvido por

**Vinicius Ribeiro Castilho** para **IntegraAiCom**
