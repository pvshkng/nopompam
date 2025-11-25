import { useState } from "react";

export function useDossier() {
  const [dossierOpen, setDossierOpen] = useState(false);
  const [artifacts, setArtifacts] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  return {
    dossierOpen,
    setDossierOpen,
    artifacts,
    setArtifacts,
    activeTab,
    setActiveTab,
  };
}

