import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import type { ColorScheme } from "@/types/colorScheme";

function colorSchemeToShikiTheme(scheme: ColorScheme) {
  return {
    name: scheme.name || "Custom",
    type: scheme.category,
    colors: {
      "editor.background": scheme.colors.black,
      "editor.foreground": scheme.colors.white,
    },
    tokenColors: [
      {
        scope: ["comment"],
        settings: {
          foreground: scheme.colors.brightBlack,
          fontStyle: "italic",
        },
      },
      { scope: ["string"], settings: { foreground: scheme.colors.green } },
      {
        scope: ["keyword", "storage.type"],
        settings: { foreground: scheme.colors.magenta, fontStyle: "bold" },
      },
      {
        scope: ["variable", "parameter"],
        settings: { foreground: scheme.colors.red },
      },
      {
        scope: ["constant.numeric"],
        settings: { foreground: scheme.colors.cyan },
      },
      {
        scope: ["entity.name.function", "support.function"],
        settings: { foreground: scheme.colors.blue },
      },
      {
        scope: ["entity.name.class", "support.class"],
        settings: { foreground: scheme.colors.brightBlue },
      },
      { scope: ["punctuation"], settings: { foreground: scheme.colors.white } },
    ],
  };
}

export function useShikiHighlighterCode(
  code: string,
  lang: string,
  scheme: ColorScheme,
) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const theme = colorSchemeToShikiTheme(scheme);
    (async () => {
      const highlighter = await createHighlighter({
        themes: [
          {
            name: theme.name,
            type: theme.type as "light" | "dark",
            tokenColors: theme.tokenColors,
            colors: theme.colors,
          },
        ],
        langs: [lang],
      });
      if (!cancelled) {
        setHtml(highlighter.codeToHtml(code, { lang, theme: theme.name }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, lang, scheme]);

  return html;
}
