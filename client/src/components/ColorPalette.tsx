interface ColorPaletteProps {
  colors: {
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    brightBlack: string;
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightMagenta: string;
    brightCyan: string;
    brightWhite: string;
  };
  size?: "sm" | "md" | "lg";
}

export const ColorPalette = ({ colors, size = "md" }: ColorPaletteProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const colorArray = [
    { name: "black", value: colors.black },
    { name: "red", value: colors.red },
    { name: "green", value: colors.green },
    { name: "yellow", value: colors.yellow },
    { name: "blue", value: colors.blue },
    { name: "magenta", value: colors.magenta },
    { name: "cyan", value: colors.cyan },
    { name: "white", value: colors.white },
    { name: "bright black", value: colors.brightBlack },
    { name: "bright red", value: colors.brightRed },
    { name: "bright green", value: colors.brightGreen },
    { name: "bright yellow", value: colors.brightYellow },
    { name: "bright blue", value: colors.brightBlue },
    { name: "bright magenta", value: colors.brightMagenta },
    { name: "bright cyan", value: colors.brightCyan },
    { name: "bright white", value: colors.brightWhite },
  ];

  return (
    <div className="grid grid-cols-8 gap-1">
      {colorArray.map((color) => (
        <div
          key={color.name}
          className={`${sizeClasses[size]} rounded border border-gray-600 transition-transform hover:scale-110`}
          style={{ backgroundColor: color.value }}
          title={`${color.name}: ${color.value}`}
        />
      ))}
    </div>
  );
};
