const LANGUAGE_PATTERNS = [
  ["bash", /^(?:\$|#)\s|^(?:npm|npx|yarn|pnpm|git|docker|curl)\s/m],
  ["sql", /^\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/im],
  ["json", /^\s*[{[][\s\S]*["'][\w-]+["']\s*:/m],
  ["html", /<\/?[a-z][^>]*>/i],
  ["typescript", /\b(?:interface|type)\s+\w+|\bas\s+(?:string|number|boolean)\b/],
  ["javascript", /\b(?:const|let|var|function|class|import|export|return|async|await)\b|=>/],
  ["css", /^\s*[.#][\w-]+\s*\{|^\s*[\w-]+\s*:\s*[^;]+;/m],
  ["python", /^\s*(?:def|class|import|from|print|return)\b/m],
];

const CODE_LINE_PATTERN =
  /^\s*(?:[$#]\s|(?:const|let|var|function|class|import|export|return|if|else|for|while|try|catch|async|await|npm|npx|yarn|pnpm|git|docker|curl|SELECT|INSERT|UPDATE|DELETE|CREATE|FROM|WHERE)\b|<\/?[a-z][^>]*>|[\w$.[\]]+\s*(?:=>|=\s*(?:async\s*)?(?:\{|["'`]|[\w[(]))|[{}[\]]|.*[;{}]\s*$)/i;

export default function remarkAutoCodeBlocks() {
  return (tree) => {
    tree.children = tree.children.flatMap((node) => {
      if (node.type !== "paragraph" || !node.children.every((child) => child.type === "text")) {
        return [node];
      }

      const source = node.children.map((child) => child.value).join("");
      const lines = source.split("\n").map((line) => line.trimEnd());
      const nonEmptyLines = lines.filter((line) => line.trim());
      if (!nonEmptyLines.length) return [node];

      const matchingLines = nonEmptyLines.filter((line) => CODE_LINE_PATTERN.test(line));
      const looksLikeCode =
        matchingLines.length >= 2 &&
        matchingLines.length / nonEmptyLines.length >= 0.6;

      if (!looksLikeCode) return [node];

      const language =
        LANGUAGE_PATTERNS.find(([, pattern]) => pattern.test(source))?.[0] || "";

      return [
        {
          type: "code",
          lang: language,
          meta: null,
          value: source.trim(),
          position: node.position,
        },
      ];
    });
  };
}
