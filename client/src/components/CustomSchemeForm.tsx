import React, { useState } from "react";
import { ColorScheme } from "@/types/colorScheme";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { colorSchemes } from "@/data/colorScheme";
import { getUsernameFromToken } from "@/lib/utils";

interface CustomSchemeFormProps {
  onAddScheme: (scheme: ColorScheme) => void;
}

const CustomSchemeForm = ({ onAddScheme }: CustomSchemeFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Custom",
    colors: {
      black: "#000000",
      red: "#ff0000",
      green: "#00ff00",
      yellow: "#ffff00",
      blue: "#0000ff",
      magenta: "#ff00ff",
      cyan: "#00ffff",
      white: "#ffffff",
      brightBlack: "#808080",
      brightRed: "#ff8080",
      brightGreen: "#80ff80",
      brightYellow: "#ffff80",
      brightBlue: "#8080ff",
      brightMagenta: "#ff80ff",
      brightCyan: "#80ffff",
      brightWhite: "#ffffff",
    },
  });
  const [cloneId, setCloneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleColorChange = (colorKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setLoading(true);
    setError(null);

    // POST to API
    const token = sessionStorage.getItem("token");
    const username = getUsernameFromToken(token);
    if (!token || !username) {
      setError("You must be logged in to create a color scheme.");
      setLoading(false);
      return;
    }

    const newScheme: ColorScheme = {
      id: `custom-${Date.now()}`,
      name: formData.name,
      author: username,
      category: formData.category,
      colors: formData.colors,
    };

    try {
      const res = await fetch("/api/color-schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newScheme),
      });
      if (res.ok) {
        onAddScheme(newScheme);
        setFormData({
          name: "",
          category: "Custom",
          colors: {
            black: "#000000",
            red: "#ff0000",
            green: "#00ff00",
            yellow: "#ffff00",
            blue: "#0000ff",
            magenta: "#ff00ff",
            cyan: "#00ffff",
            white: "#ffffff",
            brightBlack: "#808080",
            brightRed: "#ff8080",
            brightGreen: "#80ff80",
            brightYellow: "#ffff80",
            brightBlue: "#8080ff",
            brightMagenta: "#ff80ff",
            brightCyan: "#80ffff",
            brightWhite: "#ffffff",
          },
        });
        setIsExpanded(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to create color scheme.");
      }
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  };

  const handleClone = (id: string) => {
    const token = sessionStorage.getItem("token");
    const username = getUsernameFromToken(token);
    const scheme = colorSchemes.find((s) => s.id === id);
    if (scheme) {
      setFormData({
        name: scheme.name + " (Copy)",
        category: scheme.category,
        colors: { ...scheme.colors },
      });
      setCloneId(id);
      setIsExpanded(true);
    }
  };

  if (!isExpanded) {
    return (
      <div className="mt-6">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Custom Color Scheme
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-6">
      <h3 className="mb-4 text-xl font-semibold text-green-300">
        Create Custom Scheme
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-gray-400">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="My Custom Theme"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="clone-scheme" className="text-gray-400">
            Clone from existing scheme
          </Label>
          <div className="relative">
            <select
              id="clone-scheme"
              className="appearance-none w-full rounded border border-gray-600 bg-gray-700 text-white py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={cloneId || ""}
              onChange={(e) => handleClone(e.target.value)}
            >
              <option value="">Select a scheme to clone...</option>
              {colorSchemes.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.name} by {scheme.author}
                </option>
              ))}
            </select>
            {/* Down arrow icon */}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(formData.colors).map(([colorKey, colorValue]) => (
            <div key={colorKey}>
              <Label
                htmlFor={colorKey}
                className="text-sm text-gray-400 capitalize"
              >
                {colorKey.replace(/([A-Z])/g, " $1").toLowerCase()}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={colorKey}
                  type="color"
                  value={colorValue}
                  onChange={(e) => handleColorChange(colorKey, e.target.value)}
                  className="h-10 w-16 p-1 bg-gray-700 border-gray-600"
                />
                <Input
                  value={colorValue}
                  onChange={(e) => handleColorChange(colorKey, e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-xs font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-gray-900"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Scheme"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsExpanded(false)}
            className="border-gray-600 text-gray-400 hover:bg-gray-700"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomSchemeForm;
