import { useState } from "react";
import { ColorScheme } from "@/types/colorScheme";
import { TerminalWindow } from "@/components/TerminalWindow";
import { useShikiHighlighterCode } from "@/hooks/shiki-highlighter";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { codeSnippets } from "@/data/codeSnippet";

interface SchemePreviewProps {
  scheme: ColorScheme;
}

const languageDisplayNames: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  rust: "Rust",
  go: "Go",
};

export const SchemePreview = ({ scheme }: SchemePreviewProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const code = codeSnippets[selectedLanguage] || codeSnippets.javascript;
  const html = useShikiHighlighterCode(code, selectedLanguage, scheme);
  console.log(html);
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h3 className="mb-4 text-xl font-semibold text-green-300">
          Code Preview
        </h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="language-select" className="text-sm text-gray-400">
              Language:
            </label>
            <div>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-40 bg-gray-700 border border-gray-600 text-white">
                  {languageDisplayNames[selectedLanguage] || selectedLanguage}
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(codeSnippets).map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {languageDisplayNames[lang] || lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div
            className="rounded-lg p-4 font-mono text-sm overflow-x-auto border border-gray-700 bg-gray-800"
            style={{
              color: scheme.colors.white,
              backgroundColor: scheme.colors.black,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <TerminalWindow scheme={scheme} />

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <h4 className="mb-3 text-lg font-medium text-green-300">
            Color Values
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm font-mono">
            {Object.entries(scheme.colors).map(([name, value]) => (
              <div key={name} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded border border-gray-600"
                  style={{ backgroundColor: value }}
                />
                <span className="text-gray-400">{name}:</span>
                <span className="text-green-300">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
