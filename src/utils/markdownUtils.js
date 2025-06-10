import { marked } from "marked";
import hljs from "highlight.js";

// highlight.jsで使用可能な言語を取得
const availableLanguages = hljs.listLanguages();

// マークダウンを設定
marked.setOptions({
  highlight: function (code, lang) {
    const language = lang && availableLanguages.includes(lang) ? lang : "";
    return language
      ? hljs.highlight(code, { language }).value
      : hljs.highlightAuto(code).value;
  },
  gfm: true,
  breaks: true,
});

/**
 * HTML内のコードブロックを変換する
 * @param {string} htmlContent - ブログのHTMLコンテンツ
 * @returns {string} - 変換後のHTMLコンテンツ
 */
export function transformCodeBlocks(htmlContent) {
  if (!htmlContent) return "";

  // すべてのパターンを処理する変換関数
  const processCodeBlock = (match, filename, language, code) => {
    // filename, languageがundefinedの場合は空文字列にする
    filename = filename || "";
    language = language || "";

    // コードが存在することだけを確認
    if (!code || typeof code !== "string") {
      return match; // コードがない場合は元のままを返す
    }

    // エスケープされたHTMLエンティティをデコード
    const decodedCode = decodeHTMLEntities(code);

    // 言語とファイル名の表示部分を条件付きで作成
    const languageTag = language
      ? `<div class="language-tag">言語：${language}</div>`
      : "";

    const filenameTag = filename
      ? `<div class="filename">ファイル名：${filename}</div>`
      : "";

    // コードにシンタックスハイライトを適用
    let highlightedCode = decodedCode;
    try {
      if (language && availableLanguages.includes(language)) {
        highlightedCode = hljs.highlight(decodedCode, { language }).value;
      } else {
        highlightedCode = hljs.highlightAuto(decodedCode).value;
      }
    } catch (error) {
      console.error("Highlighting error:", error);
      highlightedCode = decodedCode;
    }

    // 特定の文字列を置換して一貫した表示を確保
    highlightedCode = highlightedCode
      // イコール記号置換
      .replace(/===/g, "===")
      .replace(/==/g, "==")
      // 矢印演算子置換
      .replace(/⇒/g, "=>")
      .replace(/→/g, "->")
      .replace(/=>/g, "=>")
      // その他の演算子も必要に応じて追加
      .replace(/≠/g, "!=")
      .replace(/≥/g, ">=")
      .replace(/≤/g, "<=");

    // 行番号表示用にさらに処理 - HTMLエンティティを文字に変換
    const processedLines = highlightedCode
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&");

    // 行ごとに分割
    const codeLines = processedLines.split("\n");

    // 行ごとのコードを生成
    let linesWithNumbers = "";
    codeLines.forEach((line, index) => {
      // 最終行が空の場合にスキップ（余分な改行を防ぐ）
      if (index === codeLines.length - 1 && line === "") return;

      // 行番号とコード行を追加
      linesWithNumbers += `<div class="code-line-wrapper">
        <span class="line-number">${index + 1}</span>
        <span class="code-line">${line || " "}</span>
      </div>`;
    });

    // コードブロックを装飾した要素に変換
    return `<div class="code-block-wrapper">
      <div class="code-header">
        ${languageTag}
        ${filenameTag}
        <div class="code-actions">
          <label class="line-numbers-toggle">
            <input type="checkbox" class="line-numbers-checkbox" onclick="toggleLineNumbers(this)">
            <span class="line-numbers-label">行番号</span>
          </label>
          <button class="copy-button" onclick="copyCodeBlock(this)">コピー</button>
        </div>
      </div>
      <div class="code-container">
        <pre class="code-pre with-line-numbers-new">${linesWithNumbers}</pre>
        <pre class="code-pre code-only"><code class="${
          language ? "language-" + language : ""
        } hljs">${decodedCode}</code></pre>
      </div>
    </div>`;
  };

  // 1. data-filename属性を持つdivとそれに続くpre>codeを検出
  const codeBlockWithFilenameRegex =
    /<div data-filename=['"](.*?)['"]>\s*<pre>\s*<code class=['"]language-(.*?)['"]>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/g;

  // 2. language-classを持つシンプルなコードブロック
  const codeBlockWithLanguageRegex =
    /<pre>\s*<code class=['"]language-(.*?)['"]>([\s\S]*?)<\/code>\s*<\/pre>/g;

  // 3. 言語指定のないシンプルなpre>codeブロック
  const simpleCodeBlockRegex = /<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>/g;

  // パターン1: data-filenameを持つコードブロックを変換
  let transformedContent = htmlContent.replace(
    codeBlockWithFilenameRegex,
    (match, filename, language, code) => {
      return processCodeBlock(match, filename, language, code);
    }
  );

  // パターン2: 言語指定のあるコードブロックを変換
  transformedContent = transformedContent.replace(
    codeBlockWithLanguageRegex,
    (match, language, code) => {
      return processCodeBlock(match, "", language, code);
    }
  );

  // パターン3: シンプルなコードブロックを変換 (言語とファイル名なし)
  transformedContent = transformedContent.replace(
    simpleCodeBlockRegex,
    (match, code) => {
      return processCodeBlock(match, "", "", code);
    }
  );

  return transformedContent;
}

/**
 * HTML内のiframely埋め込みを処理する（scriptタグを除去）
 * @param {string} htmlContent - ブログのHTMLコンテンツ
 * @returns {string} - 変換後のHTMLコンテンツ
 */
export function processIframelyEmbeds(htmlContent) {
  if (!htmlContent) {
    return "";
  }
  let processedContent = htmlContent;

  // 問題を引き起こすscriptタグを除去（ハイドレーションエラー対策）
  const scriptTagRegex =
    /<script[^>]*src=["']\/\/cdn\.iframe\.ly\/embed\.js["'][^>]*><\/script>/g;
  processedContent = processedContent.replace(scriptTagRegex, "");

  return processedContent;
}

/**
 * HTMLエンティティをデコードする
 * @param {string} text - デコードするテキスト
 * @returns {string} - デコードされたテキスト
 */
function decodeHTMLEntities(text) {
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&#x2F;": "/",
    "&nbsp;": " ",
    "&equals;": "=",
    "&equals;&equals;": "==",
    "&equals;&equals;&equals;": "===",
    "&rArr;": "=>", // 右矢印 Unicode エンティティ
    "&rarr;": "->", // 右矢印 Unicode エンティティ
    "&equals;&gt;": "=>", // =>のHTML表現
  };

  return text.replace(/&[^;]+;/g, (entity) => {
    return entities[entity] || entity;
  });
}

/**
 * マークダウンをHTMLに変換する
 * @param {string} markdown - マークダウンテキスト
 * @returns {string} - 変換後のHTML
 */
export function convertMarkdownToHtml(markdown) {
  if (!markdown) return "";
  return marked.parse(markdown);
}

export default {
  transformCodeBlocks,
  processIframelyEmbeds,
  convertMarkdownToHtml,
};
