import { useEffect, useState } from "react";
import { ColorScheme } from "@/types/colorScheme";
import { ColorPalette } from "@/components/ColorPalette";

interface ColorSchemeGridProps {
  schemes: ColorScheme[];
  selectedScheme: ColorScheme;
  onSchemeSelect: (scheme: ColorScheme) => void;
}

export const ColorSchemeGrid = ({
  schemes,
  selectedScheme,
  onSchemeSelect,
}: ColorSchemeGridProps) => {
  const [userSchemes, setUserSchemes] = useState<ColorScheme[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
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
  }, []);

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
      {allSchemes.map((scheme) => (
        <div
          key={scheme.id}
          onClick={() => onSchemeSelect(scheme)}
          className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-green-400 ${
            selectedScheme.id === scheme.id
              ? "border-green-400 bg-gray-800"
              : "border-gray-700 bg-gray-850 hover:bg-gray-800"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-300">
              {scheme.name}
            </h3>
            <span className="text-sm text-gray-400">{scheme.author}</span>
          </div>
          <ColorPalette colors={scheme.colors} size="sm" />
        </div>
      ))}
    </div>
  );
};
