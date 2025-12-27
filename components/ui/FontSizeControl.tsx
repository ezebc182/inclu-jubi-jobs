"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "./button";

type FontSize = "normal" | "large" | "xl";

const FONT_SIZE_CONFIG = {
  normal: {
    label: "Normal",
    className: "",
    scale: 1,
  },
  large: {
    label: "Grande",
    className: "font-size-large",
    scale: 1.125, // 12.5% larger
  },
  xl: {
    label: "Muy grande",
    className: "font-size-xl",
    scale: 1.25, // 25% larger
  },
};

export function FontSizeControl() {
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fontSize") as FontSize;
    if (saved && FONT_SIZE_CONFIG[saved]) {
      setFontSize(saved);
      applyFontSize(saved);
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    // Remove all font size classes
    document.documentElement.classList.remove(
      "font-size-large",
      "font-size-xl"
    );

    // Add new class if not normal
    if (size !== "normal") {
      document.documentElement.classList.add(FONT_SIZE_CONFIG[size].className);
    }
  };

  const handleChange = (newSize: FontSize) => {
    setFontSize(newSize);
    applyFontSize(newSize);
    localStorage.setItem("fontSize", newSize);

    // Announce to screen readers
    const announcement = `Tamaño de texto cambiado a ${FONT_SIZE_CONFIG[newSize].label}`;
    announceToScreenReader(announcement);
  };

  const handleIncrease = () => {
    const sizes: FontSize[] = ["normal", "large", "xl"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      handleChange(sizes[currentIndex + 1]);
    }
  };

  const handleDecrease = () => {
    const sizes: FontSize[] = ["normal", "large", "xl"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      handleChange(sizes[currentIndex - 1]);
    }
  };

  const handleReset = () => {
    handleChange("normal");
  };

  return (
    <>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="font-size-status"
      />

      {/* Desktop: Always visible controls */}
      <div className="hidden md:flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Texto:
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={fontSize === "normal"}
          aria-label="Disminuir tamaño de texto"
          title="Disminuir tamaño"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="min-w-[90px] text-center text-sm font-medium text-gray-900 dark:text-gray-100">
          {FONT_SIZE_CONFIG[fontSize].label}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrease}
          disabled={fontSize === "xl"}
          aria-label="Aumentar tamaño de texto"
          title="Aumentar tamaño"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={fontSize === "normal"}
          aria-label="Restablecer tamaño de texto"
          title="Restablecer"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {/* Mobile: Collapsible panel */}
      <div className="md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Ajustar tamaño de texto"
        >
          <span className="text-lg">A</span>
          <Plus className="h-3 w-3" aria-hidden="true" />
        </Button>

        {isOpen && (
          <div className="absolute right-4 top-16 z-50 rounded-lg border-2 border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tamaño de texto
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleDecrease();
                  setIsOpen(false);
                }}
                disabled={fontSize === "normal"}
                aria-label="Disminuir tamaño de texto"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="min-w-[90px] text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                {FONT_SIZE_CONFIG[fontSize].label}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleIncrease();
                  setIsOpen(false);
                }}
                disabled={fontSize === "xl"}
                aria-label="Aumentar tamaño de texto"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleReset();
                setIsOpen(false);
              }}
              disabled={fontSize === "normal"}
              className="mt-2 w-full"
            >
              Restablecer
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

// Helper to announce changes to screen readers
function announceToScreenReader(message: string) {
  const status = document.getElementById("font-size-status");
  if (status) {
    status.textContent = message;
    setTimeout(() => {
      status.textContent = "";
    }, 1000);
  }
}
