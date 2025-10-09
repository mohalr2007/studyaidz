"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  // TODO: Implement language switching logic
  const toggleLanguage = () => {
    console.log("Language toggle clicked. Implement logic here.");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleLanguage}>
      <Languages className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}
