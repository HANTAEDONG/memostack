"use client";

import { Button } from "@/shared/ui/shadcn/button";
import { Loader2 } from "lucide-react";

export function AuthLoadingButton() {
  return (
    <Button variant="ghost" size="sm" disabled>
      <Loader2 className="h-4 w-4 animate-spin" />
      로딩 중...
    </Button>
  );
}
