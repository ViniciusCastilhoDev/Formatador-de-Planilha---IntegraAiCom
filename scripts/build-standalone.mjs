import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const publicDir = path.join(root, "public");
const indexPath = path.join(distDir, "index.html");
const outputPath = path.join(distDir, "organizador-standalone.html");

let html = fs.readFileSync(indexPath, "utf8");

function toDataUri(filePath, mime) {
  const bytes = fs.readFileSync(filePath);
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

function publicAssetDataUri(assetPath) {
  const cleanPath = assetPath.replace(/^\//, "");
  const absolutePath = path.join(publicDir, cleanPath);
  const ext = path.extname(cleanPath).toLowerCase();
  const mimeByExt = {
    ".png": "image/png",
    ".woff2": "font/woff2",
  };

  return toDataUri(absolutePath, mimeByExt[ext] || "application/octet-stream");
}

function inlineCssAssets(css) {
  return css.replace(/url\((["']?)(\/fonts\/[^)"']+)\1\)/g, (_match, _quote, assetPath) => {
    return `url("${publicAssetDataUri(assetPath)}")`;
  });
}

function inlineStyles(documentHtml) {
  return documentHtml.replace(/<link rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g, (_match, href) => {
    const cssPath = path.join(distDir, href.replace(/^\//, ""));
    const css = inlineCssAssets(fs.readFileSync(cssPath, "utf8"));
    return `<style>${css}</style>`;
  });
}

function inlineScripts(documentHtml) {
  return documentHtml.replace(/<script type="module"[^>]+src="([^"]+)"><\/script>/g, (_match, src) => {
    const scriptPath = path.join(distDir, src.replace(/^\//, ""));
    let script = fs.readFileSync(scriptPath, "utf8");
    const logoDataUri = publicAssetDataUri("/logo.png");

    script = script.replace(/(["'`])\/logo\.png\1/g, JSON.stringify(logoDataUri));
    script = script.replace(/<\/script/gi, "<\\/script");

    return `<script>${script}</script>`;
  });
}

html = html.replace(/href="\/logo\.png"/g, `href="${publicAssetDataUri("/logo.png")}"`);
html = inlineStyles(html);
html = inlineScripts(html);

fs.writeFileSync(outputPath, html, "utf8");
console.log(`Standalone gerado em ${path.relative(root, outputPath)}`);
