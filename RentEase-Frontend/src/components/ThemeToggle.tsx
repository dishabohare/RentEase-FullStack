import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />; // Placeholder to prevent layout shift
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground transition-all hover:bg-secondary cursor-pointer"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      id="theme-toggle-btn"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 animate-pulse" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-500" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
