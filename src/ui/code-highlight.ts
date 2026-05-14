import { escapeHtml } from "../utils/html";

export function highlightCode(source: string, highlightLines: number[]): string {
  return source
    .split("\n")
    .map((line, index) => {
      const lineNumber = index + 1;
      const escapedLine = escapeHtml(line);
      const highlighted = highlightLine(escapedLine);
      const isMarked = highlightLines.includes(lineNumber);

      return `<span class="code-line ${isMarked ? "is-marked" : ""}"><span class="line-number">${String(lineNumber).padStart(2, "0")}</span><span class="line-content">${highlighted || " "}</span></span>`;
    })
    .join("");
}

function highlightLine(line: string): string {
  const commentStarts = [line.indexOf("//"), line.indexOf("#")].filter((index) => index >= 0);
  const commentIndex = commentStarts.length > 0 ? Math.min(...commentStarts) : -1;

  if (commentIndex >= 0) {
    const codePart = line.slice(0, commentIndex);
    const commentPart = line.slice(commentIndex);
    return `${highlightTokens(codePart)}<span class="token-comment">${commentPart}</span>`;
  }

  return highlightTokens(line);
}

function highlightTokens(line: string): string {
  const tokenPattern =
    /(&quot;[^&]*?&quot;|'[^']*'|`[^`]*`|\b(query|mutation|fragment|type|input|schema|async|await|return|const|Boolean|String|ID|Int|Float)\b|[{}()[\]:!,])/g;

  return line.replace(tokenPattern, (match) => {
    if (match.startsWith("&quot;") || match.startsWith("'") || match.startsWith("`")) {
      return `<span class="token-string">${match}</span>`;
    }

    if (/^[{}()[\]:!,]$/.test(match)) {
      return `<span class="token-punctuation">${match}</span>`;
    }

    return `<span class="token-keyword">${match}</span>`;
  });
}
