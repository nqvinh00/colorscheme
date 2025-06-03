import React, { useState, Suspense } from "react";
import { colorSchemes as initialColorSchemes } from "@/data/colorScheme";
import { ColorScheme } from "@/types/colorScheme";

const TerminalHeader = React.lazy(() => import("@/components/TerminalHeader"));
const ColorSchemeGrid = React.lazy(() => import("@/components/ColorSchemeGrid"));
const SchemePreview = React.lazy(() => import("@/components/SchemePreview"));
const CustomSchemeForm = React.lazy(() => import("@/components/CustomSchemeForm"));

const Index = () => {
  const [colorSchemes, setColorSchemes] = useState(initialColorSchemes);
  const [selectedScheme, setSelectedScheme] = useState(colorSchemes[0]);

  const handleAddScheme = (newScheme: ColorScheme) => {
    setColorSchemes((prev) => [...prev, newScheme]);
    setSelectedScheme(newScheme);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Suspense fallback={<div>Loading header...</div>}>
        <TerminalHeader />
      </Suspense>
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              Color Schemes
            </h2>
            <Suspense fallback={<div>Loading schemes...</div>}>
              <ColorSchemeGrid
                schemes={colorSchemes}
                selectedScheme={selectedScheme}
                onSchemeSelect={setSelectedScheme}
              />
              <CustomSchemeForm onAddScheme={handleAddScheme} />
            </Suspense>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">Preview</h2>
            <Suspense fallback={<div>Loading preview...</div>}>
              <SchemePreview scheme={selectedScheme} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
