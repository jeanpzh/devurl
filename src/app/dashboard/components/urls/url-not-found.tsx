import { Card, CardContent } from "@/components/ui/card";
import { Link2, Sparkles } from "lucide-react";
import React from "react";

export default function URLNotFound() {
  return (
    <Card className="col-span-full border-dashed border-2 border-muted-foreground/20 bg-muted/30">
      <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="relative">
          <Link2 className="size-16 text-muted-foreground/40" />
          <Sparkles className="size-6 text-accent absolute -top-1 -right-1 " />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            No se encontraron enlaces
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            No se encontraron enlaces con el término de búsqueda.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
