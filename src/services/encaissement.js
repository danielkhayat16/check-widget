export function setupEncaissement(container, chequeData) {
  // Ajoute le bouton si pas déjà présent
  if (document.getElementById("btn-encaisser")) return;

  const btn = document.createElement("button");
  btn.id = "btn-encaisser";
  btn.textContent = "Encaisser le chèque";
  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = "Encaissement en cours...";
    // Simule l'appel API d'encaissement
    setTimeout(() => {
      btn.textContent = "Chèque encaissé !";
    }, 1500);
  };
  container.appendChild(btn);
}
