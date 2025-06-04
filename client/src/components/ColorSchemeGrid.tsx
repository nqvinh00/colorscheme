import React, { Suspense, useEffect, useState } from "react";
import { ColorScheme } from "@/types/colorScheme";
const ColorPalette = React.lazy(() => import("@/components/ColorPalette"));
import CustomSchemeForm from "@/components/CustomSchemeForm";
import { Pencil } from "lucide-react";

interface ColorSchemeGridProps {
  schemes: ColorScheme[];
  selectedScheme: ColorScheme;
  onSchemeSelect: (scheme: ColorScheme) => void;
}

const ColorSchemeGrid = ({
  schemes,
  selectedScheme,
  onSchemeSelect,
  token,
  setToken,
}: ColorSchemeGridProps & { token: string | null, setToken: (t: string | null) => void }) => {
  const [userSchemes, setUserSchemes] = useState<ColorScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingScheme, setEditingScheme] = useState<ColorScheme | null>(null);

  useEffect(() => {
    if (!token) {
      setUserSchemes([]);
      return;
    }
    setLoading(true);
    fetch("/api/color-schemes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setUserSchemes(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // Merge schemes, avoiding duplicates by id
  const allSchemes = [
    ...schemes,
    ...userSchemes.filter((us) => !schemes.some((s) => s.id === us.id)),
  ];

  return (
    <div className="grid gap-4">
      {loading && (
        <div className="text-gray-400">Loading your color schemes...</div>
      )}
      {allSchemes.map((scheme) => {
        const isUserScheme = userSchemes.some((us) => us.id === scheme.id);
        if (editingScheme && editingScheme.id === scheme.id) {
          return (
            <CustomSchemeForm
              key={scheme.id}
              mode="edit"
              initialScheme={editingScheme}
              onUpdateScheme={(updated) => {
                setUserSchemes((prev) =>
                  prev.map((s) => (s.id === updated.id ? updated : s))
                );
                setEditingScheme(null);
              }}
              onCancel={() => setEditingScheme(null)}
            />
          );
        }
        return (
          <div
            key={scheme.id}
            onClick={() => onSchemeSelect(scheme)}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-green-400 ${selectedScheme.id === scheme.id
              ? "border-green-400 bg-gray-800"
              : "border-gray-700 bg-gray-850 hover:bg-gray-800"
              }`}
          >
            {isUserScheme && (
              <button
                className="absolute top-2 right-2 z-10 rounded-full border border-blue-400 bg-gray-900/80 p-1 text-blue-400 hover:bg-blue-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingScheme(scheme);
                }}
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-green-300">
                {scheme.name}
              </h3>
              <div className="text-sm text-gray-400 mt-1">
                {scheme.author}
              </div>
            </div>
            <Suspense fallback={<div className="text-gray-400">Loading palette...</div>}>
              <ColorPalette colors={scheme.colors} size="sm" />
            </Suspense>
          </div>
        );
      })}
    </div>
  );
};

export default ColorSchemeGrid;
