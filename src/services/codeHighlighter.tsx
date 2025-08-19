"use client"

import { useEffect } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-css"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-python"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-sql"
import "prismjs/plugins/line-numbers/prism-line-numbers.js"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

interface CodeHighlighterProps {
  content: string
}

export default function CodeHighlighter({ content }: CodeHighlighterProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      Prism.highlightAll()
    }
  }, [content])

  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

// "use client";

// import { useEffect } from "react";
// import hljs from "highlight.js/lib/core";

// // Import only the languages you need (optional: improves bundle size)
// import javascript from "highlight.js/lib/languages/javascript";
// import typescript from "highlight.js/lib/languages/typescript";
// import css from "highlight.js/lib/languages/css";

// import "highlight.js/styles/github-dark.css"; // Or any other style

// hljs.registerLanguage("javascript", javascript);
// hljs.registerLanguage("typescript", typescript);
// hljs.registerLanguage("css", css);

// export default function CodeHighlighter({ children }: { children: React.ReactNode }) {
//   useEffect(() => {
//     // Manually highlight each element
//     document.querySelectorAll("pre code").forEach((el) => {
//       hljs.highlightElement(el as HTMLElement);
//     });
//   }, []);

//   return <>{children}</>;
// }