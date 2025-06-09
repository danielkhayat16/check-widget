export function renderSignature(container, base64Signature) {
  if (!container) return;
  container.innerHTML = `
    <div class="signature">
      <label>Signature :</label><br>
      <img src="${base64Signature}" alt="Signature" style="max-width:150px;">
    </div>
  `;
}