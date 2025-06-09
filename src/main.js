import { renderChequeView } from "./components/chequeView.js";
import { renderSignature } from "./components/signature.js";
import { setupEncaissement } from "./services/encaissement.js";

// Expose la fonction globale pour les intégrateurs
window.initChequeWidget = async function (config) {
  const container = document.getElementById("cheque-widget-container");
  if (!container) {
    console.error(
      '[ChequeWidget] No container found with ID "cheque-widget-container"'
    );
    return;
  }

  // Si pas de chequeId, mode création
  if (!config.chequeId) {
    renderChequeForm(container);
    return;
  }

  try {
    // 1. Récupère les données du chèque depuis l'API de la banque
    const chequeData = await fetchCheque(config.chequeId, config.authToken);

    // 2. Rendu du chèque
    renderChequeView(container, chequeData);

    // 3. Initialisation de la signature (si statut = "issued")
    const signatureContainer = document.getElementById("signature-container");
    const base64Signature = "data:image/png;base64,iVBORw0K..."; // ta signature base64
    renderSignature(signatureContainer, base64Signature);

    // 4. Ajout du bouton "Encaisser" si le chèque est signé
    if (chequeData.status === "signed") {
      setupEncaissement(
        container,
        chequeData /*, config.bankApi si nécessaire */
      );
    }
  } catch (error) {
    console.error("[ChequeWidget] Error initializing widget:", error);
    container.innerHTML =
      '<p style="color:red;">Erreur de chargement du chèque.</p>';
    renderChequeForm(container);
  }
};

// Fonction pour récupérer les données du chèque via API (mock ou réelle)
async function fetchCheque(chequeId, authToken) {
  throw new Error("Pas d'API disponible");
  const response = await fetch(
    `https://api.chequedigital.io/checks/${chequeId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la récupération du chèque");
  return await response.json();
}

function renderChequeForm(container) {
  const chequeNumber = Math.floor(Math.random() * 1000000);
  // Ajoute l'import CSS si besoin (pour test local)
  if (!document.getElementById("cheque-form-css")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/chequeView.css";
    link.id = "cheque-form-css";
    document.head.appendChild(link);
  }
  container.innerHTML = `
    <form id="cheque-create-form" class="cheque-form-cheque">
      <div class="cheque-form-header">
        <div class="cheque-form-header-left">
          <div style="font-size: 1.1em; color: #2d6fa1; margin-bottom: 8px;">
            <b>Chèque N° ${chequeNumber}</b>
          </div>
          <label class="cheque-form-label">
            Bénéficiaire :
            <input name="payee" required class="cheque-form-input">
          </label>
          <label class="cheque-form-label">
            Date d'émission :
            <input name="issueDate" type="date" required class="cheque-form-input">
          </label>
        </div>
        <div class="cheque-form-header-right">
          <label class="cheque-form-label" style="font-size:1.2em; color:#2d6fa1;">
            Montant (€) :
            <input name="amount" type="number" required min="1" step="0.01" class="cheque-form-amount">
          </label>
          <label class="cheque-form-label" style="margin-top:12px;">
            Montant en lettres :
            <input name="amountLetters" required class="cheque-form-input" placeholder="Ex : Mille euros">
          </label>
        </div>
      </div>
      <div class="cheque-form-signature-row">
        <div id="signature-pad-container" style="text-align:right;"></div>
      </div>
      <div class="cheque-form-submit-row">
        <button type="submit" class="cheque-form-submit-btn">Créer et signer</button>
      </div>
    </form>
    <div id="signature-container"></div>
  `;

  // Ajoute le champ de signature dans le formulaire
  const sigPad = createSignaturePad();
  document
    .getElementById("signature-pad-container")
    .appendChild(sigPad.container);

  const form = document.getElementById("cheque-create-form");
  form.onsubmit = function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const base64Signature = sigPad.getSignature();

    const chequeData = {
      number: Math.floor(Math.random() * 10000),
      payee: data.payee,
      amount: data.amount,
      amountLetters: data.amountLetters,
      issueDate: data.issueDate,
      status: "signed",
    };
 
    container.innerHTML = "";
    renderChequeView(container, chequeData);
    const signatureContainer = document.getElementById("signature-container");

    renderSignature(signatureContainer, base64Signature);
    setupEncaissement(container, chequeData);
  };
}

function createSignaturePad(containerId = "signature-pad-container") {
  const container = document.createElement("div");
  container.id = containerId;
  container.innerHTML = `
    <label>Signature :</label><br>
    <canvas id="signature-pad" width="300" height="80" style="border:1px solid #888; background:#fff;"></canvas>
    <button type="button" id="clear-signature" style="margin-left:10px;">Clear</button>
    <br><br>`;

  const canvas = container.querySelector("#signature-pad");
  const ctx = canvas.getContext("2d");
  let drawing = false;

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  canvas.addEventListener("mouseup", () => (drawing = false));
  canvas.addEventListener("mouseleave", () => (drawing = false));

  container.querySelector("#clear-signature").onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  function getSignature() {
    return canvas.toDataURL();
  }

  return { container, getSignature };
}
