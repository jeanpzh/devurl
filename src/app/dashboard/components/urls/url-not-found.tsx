import { Link2 } from "lucide-react";
import React from "react";
import DashboardEmptyState from "../dashboard-empty-state";

export default function URLNotFound({
  debouncedTerm,
}: {
  debouncedTerm?: string;
}) {
  const isSearching = debouncedTerm && debouncedTerm.trim() !== "";
  return isSearching ? (
    <DashboardEmptyState
      icon={Link2}
      title="No hay coincidencias"
      description={`No se encontraron links para "${debouncedTerm}". Prueba con otro término de búsqueda.`}
    />
  ) : (
    <DashboardEmptyState
      icon={Link2}
      title="Aún no hay links"
      description="Crea tu primer enlace corto para comenzar a compartirlo y medir su actividad."
      action={{ label: "Crear primer link", href: "#create-link" }}
    />
  );
}
