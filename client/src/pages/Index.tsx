import React, { useState } from "react";
import { TerminalHeader } from "@/components/TerminalHeader";
import { ColorSchemeGrid } from "@/components/ColorSchemeGrid";
import { SchemePreview } from "@/components/SchemePreview";
import { CustomSchemeForm } from "@/components/CustomSchemeForm";
import { colorSchemes as initialColorSchemes } from "@/data/colorScheme";
import { ColorScheme } from "@/types/colorScheme";

const Index = () => {
  const [colorSchemes, setColorSchemes] = useState(initialColorSchemes);
  const [selectedScheme, setSelectedScheme] = useState(colorSchemes[0]);

  const handleAddScheme = (newScheme: ColorScheme) => {
    setColorSchemes((prev) => [...prev, newScheme]);
    setSelectedScheme(newScheme);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <TerminalHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              Color Schemes
            </h2>
            <ColorSchemeGrid
              schemes={colorSchemes}
              selectedScheme={selectedScheme}
              onSchemeSelect={setSelectedScheme}
            />
            <CustomSchemeForm onAddScheme={handleAddScheme} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">Preview</h2>
            <SchemePreview scheme={selectedScheme} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
