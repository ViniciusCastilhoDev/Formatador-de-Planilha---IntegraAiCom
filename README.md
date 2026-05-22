# Organizador de Planilhas para Disparos - IntegraAiCom

Projeto React com Vite para preparar listas de contatos para disparos no WhatsApp. O processamento continua 100% no navegador.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run build:standalone
npm run preview
```

## Estrutura

- `src/components/Upload.jsx` - upload e drag-and-drop da planilha
- `src/components/GeneralConfig.jsx` - configurações gerais
- `src/components/SectionConfig.jsx` - configuração por abas/seções
- `src/components/Summary.jsx` - preview, progresso e métricas finais
- `src/components/Download.jsx` - ação de preparação e download
- `src/utils/phoneUtils.js` - regra central de validação/formatação via `formatarNumeroWhatsApp`
- `src/utils/columnDetector.js` - detecção de colunas
- `src/utils/contactProcessor.js` - extração, validação e duplicados
- `src/utils/sectionProcessor.js` - análise e regras por seção
- `src/utils/fileNameUtils.js` - normalização de nomes e textos
- `src/services/excelService.js` - leitura/escrita de planilhas
- `src/services/zipService.js` - criação e download do ZIP
- `src/services/reportService.js` - relatórios gerados no ZIP
- `scripts/build-standalone.mjs` - gera `dist/organizador-standalone.html` com JS, CSS, logo e fontes embutidos

## Regra de telefone

Toda validação e formatação de números fica centralizada em `src/utils/phoneUtils.js`. O restante do sistema chama `formatarNumeroWhatsApp(numeroBruto, dddBruto, dddPadrao, forcarNonoDigito)` para primeiro limpar/formatar e só depois validar.

O formato final aceito é `55 + DDD + número local`, sem espaços, traços, parênteses ou `+`. Celulares com 9 dígitos e fixos com 8 dígitos são aceitos.

## Observação

O arquivo HTML standalone original foi mantido no repositório como referência histórica; a entrada atual do projeto é `index.html` com Vite.
