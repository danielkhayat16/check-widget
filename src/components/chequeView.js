export function renderChequeView(container, chequeData) {
  container.innerHTML = `
    <div class="cheque-view">
      <h3>Chèque N° ${chequeData.number}</h3>
      <p>Montant : <b>${chequeData.amount} €</b></p>
      <p>Bénéficiaire : ${chequeData.payee}</p>
      <p>Date d'émission : ${chequeData.issueDate}</p>
      <div id="signature-container"></div>
    </div>
  `;
}
