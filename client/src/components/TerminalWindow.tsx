import { ColorScheme } from "@/types/colorScheme";

interface TerminalWindowProps {
  scheme: ColorScheme;
}

const TerminalWindow = ({ scheme }: TerminalWindowProps) => {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-1">
      <div className="flex items-center gap-2 rounded-t-lg bg-gray-700 px-4 py-2">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-sm text-gray-400">terminal</span>
      </div>
      <div
        className="rounded-b-lg p-4 font-mono text-sm leading-relaxed"
        style={{
          backgroundColor: scheme.colors.black,
          color: scheme.colors.white,
        }}
      >
        <div className="space-y-1">
          <div>
            <span style={{ color: scheme.colors.green }}>user@terminal</span>
            <span style={{ color: scheme.colors.white }}>:</span>
            <span style={{ color: scheme.colors.blue }}>~</span>
            <span style={{ color: scheme.colors.white }}>$ </span>
            <span>ls -la</span>
          </div>
          <div style={{ color: scheme.colors.cyan }}>total 42</div>
          <div>
            <span style={{ color: scheme.colors.blue }}>drwxr-xr-x</span>
            <span style={{ color: scheme.colors.white }}>
              {" "}
              5 user user 4096 Dec 1 10:30{" "}
            </span>
            <span style={{ color: scheme.colors.brightBlue }}>.</span>
          </div>
          <div>
            <span style={{ color: scheme.colors.blue }}>drwxr-xr-x</span>
            <span style={{ color: scheme.colors.white }}>
              {" "}
              3 root root 4096 Nov 30 09:15{" "}
            </span>
            <span style={{ color: scheme.colors.brightBlue }}>..</span>
          </div>
          <div>
            <span style={{ color: scheme.colors.green }}>-rw-r--r--</span>
            <span style={{ color: scheme.colors.white }}>
              {" "}
              1 user user 220 Nov 30 09:15{" "}
            </span>
            <span style={{ color: scheme.colors.brightGreen }}>.bashrc</span>
          </div>
          <div>
            <span style={{ color: scheme.colors.red }}>-rwxr-xr-x</span>
            <span style={{ color: scheme.colors.white }}>
              {" "}
              1 user user 1024 Dec 1 10:25{" "}
            </span>
            <span style={{ color: scheme.colors.brightRed }}>script.sh</span>
          </div>
          <div>
            <span style={{ color: scheme.colors.yellow }}>-rw-r--r--</span>
            <span style={{ color: scheme.colors.white }}>
              {" "}
              1 user user 2048 Dec 1 10:30{" "}
            </span>
            <span style={{ color: scheme.colors.brightYellow }}>
              config.json
            </span>
          </div>
          <div className="mt-2">
            <span style={{ color: scheme.colors.green }}>user@terminal</span>
            <span style={{ color: scheme.colors.white }}>:</span>
            <span style={{ color: scheme.colors.blue }}>~</span>
            <span style={{ color: scheme.colors.white }}>$ </span>
            <span className="animate-pulse">|</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalWindow;
